const supabaseClient = window.IDEIAS_SUPABASE?.client || null;
const LOCAL_KEY='pratopronto-data-v2';
const ACTIVE_PLAN_KEY='pratopronto-active-plan-v2';

const INGREDIENTS={
  rice:{name:'Arroz',unit:'g',cents:1.0},
  beans:{name:'Feijão',unit:'g',cents:1.2},
  pasta:{name:'Macarrão',unit:'g',cents:.9},
  egg:{name:'Ovos',unit:'un',cents:100},
  chicken:{name:'Frango',unit:'g',cents:2.0},
  beef:{name:'Carne moída',unit:'g',cents:3.2},
  lentil:{name:'Lentilha',unit:'g',cents:1.5},
  chickpea:{name:'Grão-de-bico',unit:'g',cents:2.0},
  potato:{name:'Batata',unit:'g',cents:.7},
  carrot:{name:'Cenoura',unit:'g',cents:.8},
  pumpkin:{name:'Abóbora',unit:'g',cents:.7},
  tomato:{name:'Tomate',unit:'g',cents:1.2},
  leaves:{name:'Folhas para salada',unit:'g',cents:2.0},
  onion:{name:'Cebola',unit:'g',cents:.8},
  garlic:{name:'Alho',unit:'g',cents:4.0},
  tomatoSauce:{name:'Molho de tomate',unit:'ml',cents:.7},
  oil:{name:'Óleo',unit:'ml',cents:1.5}
};

const MEALS=[
  {title:'Arroz, feijão, ovos e salada',tags:['vegetarian','no-red-meat'],ingredients:{rice:100,beans:80,egg:2,tomato:80,leaves:40,onion:20,oil:10},steps:['Cozinhe arroz e feijão.','Prepare os ovos como preferir.','Finalize com salada simples.']},
  {title:'Frango com arroz e legumes',tags:['no-red-meat'],ingredients:{rice:100,chicken:150,carrot:80,onion:30,garlic:5,oil:10},steps:['Doure cebola e alho.','Cozinhe o frango e a cenoura.','Sirva com arroz.']},
  {title:'Macarrão ao molho com legumes',tags:['vegetarian','no-red-meat'],ingredients:{pasta:120,tomatoSauce:100,carrot:60,onion:30,garlic:5,oil:8},steps:['Cozinhe o macarrão.','Refogue os legumes e adicione o molho.','Misture e sirva.']},
  {title:'Lentilha com arroz e cenoura',tags:['vegetarian','no-red-meat'],ingredients:{rice:100,lentil:80,carrot:80,onion:30,garlic:5,oil:8},steps:['Cozinhe a lentilha.','Refogue cebola, alho e cenoura.','Sirva com arroz.']},
  {title:'Omelete com batata e salada',tags:['vegetarian','no-red-meat'],ingredients:{egg:3,potato:150,tomato:70,leaves:40,onion:20,oil:8},steps:['Cozinhe ou asse a batata.','Prepare a omelete com cebola.','Sirva com salada.']},
  {title:'Sopa de legumes com frango',tags:['no-red-meat'],ingredients:{chicken:100,potato:120,carrot:80,pumpkin:100,onion:30,garlic:5,oil:5},steps:['Refogue cebola e alho.','Adicione frango e legumes.','Cubra com água e cozinhe até ficar macio.']},
  {title:'Carne moída com batata e arroz',tags:[],ingredients:{beef:120,potato:120,rice:80,onion:30,tomato:50,garlic:5,oil:8},steps:['Refogue cebola e alho.','Cozinhe a carne com tomate e batata.','Sirva com arroz.']},
  {title:'Grão-de-bico com arroz e legumes',tags:['vegetarian','no-red-meat'],ingredients:{chickpea:90,rice:90,carrot:70,tomato:60,onion:30,oil:8},steps:['Cozinhe o grão-de-bico.','Refogue os legumes.','Misture e sirva com arroz.']},
  {title:'Macarrão com frango e molho',tags:['no-red-meat'],ingredients:{pasta:100,chicken:100,tomatoSauce:100,onion:30,garlic:5,oil:8},steps:['Cozinhe o macarrão.','Doure o frango com cebola e alho.','Adicione molho e misture.']},
  {title:'Arroz, feijão e frango acebolado',tags:['no-red-meat'],ingredients:{rice:100,beans:80,chicken:120,onion:40,garlic:5,oil:8},steps:['Prepare arroz e feijão.','Doure o frango com cebola.','Sirva tudo junto.']}
];

const planForm=document.querySelector('#plan-form');
const planDashboard=document.querySelector('#plan-dashboard');
const planSelect=document.querySelector('#plan-select');
const mealList=document.querySelector('#meal-list');
const shoppingList=document.querySelector('#shopping-list');
const historyEl=document.querySelector('#plan-history');
const accountDialog=document.querySelector('#account-dialog');
const accountOpen=document.querySelector('#account-open');
const accountForm=document.querySelector('#auth-form');
const accountProfile=document.querySelector('#account-profile');
const accountMessage=document.querySelector('#account-message');
const importLocalButton=document.querySelector('#import-local');
const syncStatus=document.querySelector('#sync-status');

let currentUser=null;
let cloudData={plans:[],meals:[],shopping:[]};
let activePlanId=localStorage.getItem(ACTIVE_PLAN_KEY)||'';
let cloudLoading=false;

function escapeHtml(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function makeUuid(){if(crypto.randomUUID)return crypto.randomUUID();const b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;return Array.from(b,x=>x.toString(16).padStart(2,'0')).join('').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/,'$1-$2-$3-$4-$5');}
function todayString(){const d=new Date();const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);return local.toISOString().slice(0,10);}
function addDays(dateString,days){const d=new Date(dateString+'T12:00:00');d.setDate(d.getDate()+days);return d.toISOString().slice(0,10);}
function formatDate(dateString){return new Date(dateString+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'});}
function money(cents){return (Number(cents||0)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function showToast(message){const t=document.querySelector('#toast');t.textContent=message;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1800);}
function readLocal(){try{const v=JSON.parse(localStorage.getItem(LOCAL_KEY)||'{}');return{plans:Array.isArray(v.plans)?v.plans:[],meals:Array.isArray(v.meals)?v.meals:[],shopping:Array.isArray(v.shopping)?v.shopping:[]};}catch{return{plans:[],meals:[],shopping:[]};}}
function writeLocal(data){localStorage.setItem(LOCAL_KEY,JSON.stringify(data));}
function source(){return currentUser?cloudData:readLocal();}
function mapPlan(row){return{id:row.id,title:row.title,budgetCents:Number(row.weekly_budget_cents||0),people:Number(row.people||1),preferences:Array.isArray(row.preferences)?row.preferences:[],startsOn:row.starts_on,createdAt:Date.parse(row.created_at),updatedAt:Date.parse(row.updated_at)};}
function mapMeal(row){return{id:row.id,planId:row.plan_id,date:row.meal_date,type:row.meal_type,title:row.title,estimatedCostCents:Number(row.estimated_cost_cents||0),recipe:row.recipe||{},createdAt:Date.parse(row.created_at)};}
function mapShopping(row){return{id:row.id,planId:row.plan_id,item:row.item,quantity:row.quantity||'',estimatedPriceCents:Number(row.estimated_price_cents||0),checked:Boolean(row.checked),createdAt:Date.parse(row.created_at)};}
function mealCostCents(template,people){return Math.round(Object.entries(template.ingredients).reduce((sum,[key,qty])=>sum+qty*INGREDIENTS[key].cents*people,0));}
function allowedMeals(preference){if(preference==='vegetarian')return MEALS.filter(m=>m.tags.includes('vegetarian'));if(preference==='no-red-meat')return MEALS.filter(m=>m.tags.includes('no-red-meat'));return MEALS;}
function generateWeek(settings){
  const candidates=allowedMeals(settings.preference).map(meal=>({...meal,cost:mealCostCents(meal,settings.people)}));
  const sorted=[...candidates].sort((a,b)=>a.cost-b.cost);
  const chosen=[];
  if(settings.strategy==='economy'){
    for(let i=0;i<7;i++) chosen.push(sorted[i%Math.min(4,sorted.length)]);
  }else{
    const rotation=[...candidates].sort((a,b)=>a.title.localeCompare(b.title,'pt-BR'));
    for(let i=0;i<7;i++) chosen.push(rotation[i%rotation.length]);
  }
  let total=chosen.reduce((sum,m)=>sum+m.cost,0);
  const budgetCents=Math.round(settings.budget*100);
  if(total>budgetCents){
    chosen.length=0;
    for(let i=0;i<7;i++) chosen.push(sorted[i%Math.min(3,sorted.length)]);
    total=chosen.reduce((sum,m)=>sum+m.cost,0);
  }
  const planId=makeUuid();const startsOn=todayString();
  const meals=chosen.map((template,index)=>({
    id:makeUuid(),planId,date:addDays(startsOn,index),type:'main',title:template.title,estimatedCostCents:template.cost,
    recipe:{ingredients:template.ingredients,steps:template.steps,preference:settings.preference},createdAt:Date.now()
  }));
  const aggregate={};
  for(const meal of chosen){
    for(const [key,qty] of Object.entries(meal.ingredients)) aggregate[key]=(aggregate[key]||0)+qty*settings.people;
  }
  const shopping=Object.entries(aggregate).map(([key,qty])=>({
    id:makeUuid(),planId,item:INGREDIENTS[key].name,quantity:formatQuantity(key,qty),estimatedPriceCents:Math.round(qty*INGREDIENTS[key].cents),checked:false,createdAt:Date.now()
  })).sort((a,b)=>a.item.localeCompare(b.item,'pt-BR'));
  const plan={id:planId,title:'Semana de '+formatDate(startsOn),budgetCents,people:settings.people,preferences:[settings.preference,settings.strategy],startsOn,createdAt:Date.now(),updatedAt:Date.now()};
  return{plan,meals,shopping,totalCents:shopping.reduce((s,i)=>s+i.estimatedPriceCents,0),withinBudget:total<=budgetCents};
}
function formatQuantity(key,qty){
  const unit=INGREDIENTS[key].unit;
  if(unit==='un') return Math.ceil(qty)+' un';
  if(unit==='g') return qty>=1000?(qty/1000).toLocaleString('pt-BR',{maximumFractionDigits:2})+' kg':Math.round(qty)+' g';
  if(unit==='ml') return qty>=1000?(qty/1000).toLocaleString('pt-BR',{maximumFractionDigits:2})+' L':Math.round(qty)+' ml';
  return String(qty);
}
function plans(){return [...source().plans].sort((a,b)=>b.updatedAt-a.updatedAt);}
function activePlan(){const all=plans();if(!all.length)return null;let plan=all.find(p=>p.id===activePlanId);if(!plan){plan=all[0];activePlanId=plan.id;localStorage.setItem(ACTIVE_PLAN_KEY,plan.id);}return plan;}
function mealsFor(planId){return source().meals.filter(m=>m.planId===planId).sort((a,b)=>a.date.localeCompare(b.date));}
function shoppingFor(planId){return source().shopping.filter(i=>i.planId===planId).sort((a,b)=>a.item.localeCompare(b.item,'pt-BR'));}
function preferenceLabel(plan){const pref=plan.preferences[0];return{any:'Sem restrições gerais',vegetarian:'Vegetariano','no-red-meat':'Sem carne vermelha'}[pref]||pref||'Plano';}
function render(){
  const all=plans();document.querySelector('#hero-plans').textContent=String(all.length);renderHistory();
  const plan=activePlan();planDashboard.hidden=!plan;if(!plan)return;
  planSelect.innerHTML=all.map(p=>'<option value="'+escapeHtml(p.id)+'"'+(p.id===plan.id?' selected':'')+'>'+escapeHtml(p.title)+' · '+money(p.budgetCents)+'</option>').join('');
  const meals=mealsFor(plan.id);const shopping=shoppingFor(plan.id);
  const estimate=shopping.reduce((s,i)=>s+i.estimatedPriceCents,0);const margin=plan.budgetCents-estimate;const bought=shopping.filter(i=>i.checked).length;
  document.querySelector('#metric-budget').textContent=money(plan.budgetCents);
  document.querySelector('#metric-estimate').textContent=money(estimate);
  document.querySelector('#metric-margin').textContent=(margin<0?'−':'')+money(Math.abs(margin));
  document.querySelector('#metric-margin').className=margin>=0?'positive':'negative';
  document.querySelector('#metric-bought').textContent=bought+'/'+shopping.length;
  document.querySelector('#plan-preference').textContent=preferenceLabel(plan);
  document.querySelector('#shopping-total').textContent=money(estimate);
  mealList.innerHTML=meals.length?meals.map((meal,index)=>'<article class="meal-card"><div class="meal-day"><span>Dia '+(index+1)+'</span><strong>'+escapeHtml(new Date(meal.date+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short'}))+'</strong></div><div class="meal-content"><strong>'+escapeHtml(meal.title)+'</strong><span>'+money(meal.estimatedCostCents)+' estimados</span><ol>'+(Array.isArray(meal.recipe?.steps)?meal.recipe.steps.map(step=>'<li>'+escapeHtml(step)+'</li>').join(''):'')+'</ol></div></article>').join(''):'<div class="empty-box">Sem refeições.</div>';
  shoppingList.innerHTML=shopping.length?shopping.map(item=>'<label class="shopping-item '+(item.checked?'checked':'')+'"><input type="checkbox" data-shopping="'+escapeHtml(item.id)+'"'+(item.checked?' checked':'')+'><span><strong>'+escapeHtml(item.item)+'</strong><small>'+escapeHtml(item.quantity)+'</small></span><b>'+money(item.estimatedPriceCents)+'</b></label>').join(''):'<div class="empty-box">Lista vazia.</div>';
}
function renderHistory(){
  const all=plans();
  historyEl.innerHTML=all.length?all.map(plan=>{const estimate=shoppingFor(plan.id).reduce((s,i)=>s+i.estimatedPriceCents,0);return'<article class="history-card"><div><strong>'+escapeHtml(plan.title)+'</strong><span>'+plan.people+' pessoa(s) · '+escapeHtml(preferenceLabel(plan))+'</span></div><div><strong>'+money(estimate)+'</strong><span>de '+money(plan.budgetCents)+'</span></div><button class="button ghost" data-open="'+escapeHtml(plan.id)+'" type="button">Abrir</button></article>';}).join(''):'<div class="empty-box"><strong>Nenhum plano salvo.</strong><span>Gere sua primeira semana.</span></div>';
}
async function saveGenerated(generated){
  if(currentUser&&supabaseClient){
    const p=generated.plan;
    const {data,error}=await supabaseClient.from('pratopronto_plans').insert({id:p.id,user_id:currentUser.id,title:p.title,weekly_budget_cents:p.budgetCents,people:p.people,preferences:p.preferences,starts_on:p.startsOn}).select('*').single();if(error)throw error;
    const mealRows=generated.meals.map(m=>({id:m.id,user_id:currentUser.id,plan_id:p.id,meal_date:m.date,meal_type:m.type,title:m.title,estimated_cost_cents:m.estimatedCostCents,recipe:m.recipe}));
    const shopRows=generated.shopping.map(i=>({id:i.id,user_id:currentUser.id,plan_id:p.id,item:i.item,quantity:i.quantity,estimated_price_cents:i.estimatedPriceCents,checked:false}));
    const [mr,sr]=await Promise.all([supabaseClient.from('pratopronto_meals').insert(mealRows).select('*'),supabaseClient.from('pratopronto_shopping_items').insert(shopRows).select('*')]);
    if(mr.error||sr.error){await supabaseClient.from('pratopronto_shopping_items').delete().eq('plan_id',p.id);await supabaseClient.from('pratopronto_meals').delete().eq('plan_id',p.id);await supabaseClient.from('pratopronto_plans').delete().eq('id',p.id);throw mr.error||sr.error;}
    cloudData.plans.unshift(mapPlan(data));cloudData.meals.push(...mr.data.map(mapMeal));cloudData.shopping.push(...sr.data.map(mapShopping));
  }else{
    const data=readLocal();data.plans.unshift(generated.plan);data.meals.push(...generated.meals);data.shopping.push(...generated.shopping);writeLocal(data);
  }
  activePlanId=generated.plan.id;localStorage.setItem(ACTIVE_PLAN_KEY,activePlanId);render();
}
async function toggleShopping(id,checked){
  if(currentUser&&supabaseClient){const {data,error}=await supabaseClient.from('pratopronto_shopping_items').update({checked}).eq('id',id).select('*').single();if(error)throw error;const mapped=mapShopping(data);cloudData.shopping=cloudData.shopping.map(i=>i.id===id?mapped:i);}
  else{const data=readLocal();data.shopping=data.shopping.map(i=>i.id===id?{...i,checked}:i);writeLocal(data);}
}
async function deleteActivePlan(){
  const plan=activePlan();if(!plan)return;
  if(currentUser&&supabaseClient){let r=await supabaseClient.from('pratopronto_shopping_items').delete().eq('plan_id',plan.id);if(r.error)throw r.error;r=await supabaseClient.from('pratopronto_meals').delete().eq('plan_id',plan.id);if(r.error)throw r.error;r=await supabaseClient.from('pratopronto_plans').delete().eq('id',plan.id);if(r.error)throw r.error;cloudData={plans:cloudData.plans.filter(p=>p.id!==plan.id),meals:cloudData.meals.filter(m=>m.planId!==plan.id),shopping:cloudData.shopping.filter(i=>i.planId!==plan.id)};}
  else{const data=readLocal();data.plans=data.plans.filter(p=>p.id!==plan.id);data.meals=data.meals.filter(m=>m.planId!==plan.id);data.shopping=data.shopping.filter(i=>i.planId!==plan.id);writeLocal(data);}
  activePlanId='';render();
}
async function loadCloud(){
  if(!currentUser)return;cloudLoading=true;updateAccountUi();const owner=currentUser.id;
  const [p,m,s]=await Promise.all([supabaseClient.from('pratopronto_plans').select('*').order('updated_at',{ascending:false}).limit(60),supabaseClient.from('pratopronto_meals').select('*').order('meal_date'),supabaseClient.from('pratopronto_shopping_items').select('*').order('created_at')]);
  cloudLoading=false;if(currentUser?.id!==owner)return;if(p.error||m.error||s.error)accountMessage.textContent='Parte dos seus planos não pôde ser carregada.';
  cloudData={plans:(p.data||[]).map(mapPlan),meals:(m.data||[]).map(mapMeal),shopping:(s.data||[]).map(mapShopping)};updateAccountUi();render();
}
function authErrorText(error){const m=String(error?.message||'').toLowerCase();if(m.includes('invalid login credentials'))return'E-mail ou senha incorretos.';if(m.includes('email not confirmed'))return'Confirme seu e-mail antes de entrar.';if(m.includes('already registered'))return'Este e-mail já possui conta.';if(m.includes('password should be at least'))return'Use uma senha com pelo menos 8 caracteres.';return'Não foi possível concluir. Confira os dados e tente novamente.';}
function updateAccountUi(){accountOpen.disabled=!supabaseClient;accountOpen.textContent=currentUser?'Minha conta':'Entrar / sincronizar';syncStatus.textContent=currentUser?(cloudLoading?'Sincronizando…':'Nuvem · '+(currentUser.email||'conectado')):(supabaseClient?'Modo local':'Modo local · nuvem indisponível');accountForm.hidden=Boolean(currentUser)||!supabaseClient;accountProfile.hidden=!currentUser;if(currentUser){document.querySelector('#account-email').textContent=currentUser.email||'Conta conectada';importLocalButton.hidden=readLocal().plans.length===0;}}
async function importLocal(){
  if(!currentUser)return;const local=readLocal();if(!local.plans.length)return;importLocalButton.disabled=true;accountMessage.textContent='Importando planos…';
  try{
    for(const plan of local.plans){const {error}=await supabaseClient.from('pratopronto_plans').upsert({id:plan.id,user_id:currentUser.id,title:plan.title,weekly_budget_cents:plan.budgetCents,people:plan.people,preferences:plan.preferences,starts_on:plan.startsOn,created_at:new Date(plan.createdAt).toISOString(),updated_at:new Date(plan.updatedAt).toISOString()},{onConflict:'id'});if(error)throw error;}
    if(local.meals.length){const {error}=await supabaseClient.from('pratopronto_meals').upsert(local.meals.map(m=>({id:m.id,user_id:currentUser.id,plan_id:m.planId,meal_date:m.date,meal_type:m.type,title:m.title,estimated_cost_cents:m.estimatedCostCents,recipe:m.recipe,created_at:new Date(m.createdAt).toISOString()})),{onConflict:'id'});if(error)throw error;}
    if(local.shopping.length){const {error}=await supabaseClient.from('pratopronto_shopping_items').upsert(local.shopping.map(i=>({id:i.id,user_id:currentUser.id,plan_id:i.planId,item:i.item,quantity:i.quantity,estimated_price_cents:i.estimatedPriceCents,checked:i.checked,created_at:new Date(i.createdAt).toISOString()})),{onConflict:'id'});if(error)throw error;}
    localStorage.removeItem(LOCAL_KEY);await loadCloud();accountMessage.textContent='Importação concluída.';importLocalButton.hidden=true;
  }catch(error){console.error(error);accountMessage.textContent='Não foi possível importar tudo. Os dados locais foram preservados.';}finally{importLocalButton.disabled=false;}
}
function migrateLegacy(){
  if(readLocal().plans.length)return;
  try{const legacy=JSON.parse(localStorage.getItem('ideias-plus-08-prato-pronto')||'[]');if(!Array.isArray(legacy)||!legacy.length)return;const data=readLocal();
    for(const entry of legacy.slice(0,10)){const meta=String(entry.meta||'').split(' · ');const budget=Number(String(entry.title||'').replace(/[^0-9.,]/g,'').replace(',','.'));const people=Number(meta[0])||2;if(!Number.isFinite(budget)||budget<40)continue;const pref=/veget/i.test(meta[1]||'')?'vegetarian':'any';const g=generateWeek({budget,people,preference:pref,strategy:'balanced'});g.plan.createdAt=Number(entry.time||Date.now());g.plan.updatedAt=g.plan.createdAt;data.plans.push(g.plan);data.meals.push(...g.meals);data.shopping.push(...g.shopping);}
    if(data.plans.length)writeLocal(data);
  }catch{}
}
planForm.addEventListener('submit',async event=>{event.preventDefault();if(!planForm.reportValidity())return;const v=Object.fromEntries(new FormData(planForm));const generated=generateWeek({budget:Number(v.budget),people:Number(v.people),preference:v.preference,strategy:v.strategy});const submit=planForm.querySelector('[type="submit"]');submit.disabled=true;try{await saveGenerated(generated);showToast(generated.withinBudget?'Semana criada.':'Plano criado; a estimativa mínima ultrapassa o orçamento.');}catch(error){console.error(error);showToast('Não foi possível salvar o plano.');}finally{submit.disabled=false;}});
planSelect.addEventListener('change',()=>{activePlanId=planSelect.value;localStorage.setItem(ACTIVE_PLAN_KEY,activePlanId);render();});
document.querySelector('#delete-plan').addEventListener('click',async()=>{if(!activePlan()||!window.confirm('Excluir este plano e sua lista de compras?'))return;try{await deleteActivePlan();showToast('Plano excluído.');}catch(error){console.error(error);showToast('Não foi possível excluir.');}});
shoppingList.addEventListener('change',async event=>{const input=event.target.closest('[data-shopping]');if(!input)return;input.disabled=true;try{await toggleShopping(input.dataset.shopping,input.checked);render();}catch(error){console.error(error);input.checked=!input.checked;showToast('Não foi possível atualizar o item.');}finally{input.disabled=false;}});
historyEl.addEventListener('click',event=>{const b=event.target.closest('[data-open]');if(!b)return;activePlanId=b.dataset.open;localStorage.setItem(ACTIVE_PLAN_KEY,activePlanId);render();document.querySelector('#plan-dashboard').scrollIntoView({behavior:'smooth'});});
accountOpen.addEventListener('click',()=>accountDialog.showModal());document.querySelector('#account-close').addEventListener('click',()=>accountDialog.close());accountDialog.addEventListener('click',e=>{if(e.target===accountDialog)accountDialog.close();});
accountForm.addEventListener('submit',async e=>{e.preventDefault();if(!supabaseClient)return;const b=accountForm.querySelector('[type="submit"]');b.disabled=true;accountMessage.textContent='Entrando…';try{const {error}=await supabaseClient.auth.signInWithPassword({email:accountForm.elements.email.value.trim(),password:accountForm.elements.password.value});if(error)throw error;accountMessage.textContent='Conta conectada.';}catch(error){accountMessage.textContent=authErrorText(error);}finally{b.disabled=false;}});
document.querySelector('#sign-up').addEventListener('click',async()=>{if(!supabaseClient)return;const email=accountForm.elements.email.value.trim(),password=accountForm.elements.password.value;if(!email||password.length<8){accountMessage.textContent='Informe um e-mail e uma senha com pelo menos 8 caracteres.';return;}const b=document.querySelector('#sign-up');b.disabled=true;try{const {data,error}=await supabaseClient.auth.signUp({email,password});if(error)throw error;accountMessage.textContent=data.session?'Conta criada e conectada.':'Conta criada. Confirme seu e-mail e depois entre.';}catch(error){accountMessage.textContent=authErrorText(error);}finally{b.disabled=false;}});
document.querySelector('#reset-password').addEventListener('click',async()=>{if(!supabaseClient)return;const email=accountForm.elements.email.value.trim();if(!email){accountMessage.textContent='Informe seu e-mail primeiro.';return;}try{const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.href.split('#')[0]});if(error)throw error;accountMessage.textContent='Se o e-mail estiver cadastrado, enviaremos um link de recuperação.';}catch(error){accountMessage.textContent=authErrorText(error);}});
document.querySelector('#sign-out').addEventListener('click',async()=>{if(!supabaseClient)return;const {error}=await supabaseClient.auth.signOut();accountMessage.textContent=error?'Não foi possível sair.':'Você saiu da conta.';});
importLocalButton.addEventListener('click',importLocal);
async function initAuth(){if(!supabaseClient){updateAccountUi();render();return;}let activeUserId=null;const setSession=session=>{const user=session?.user||null;if(user?.id===activeUserId)return;activeUserId=user?.id||null;currentUser=user;cloudData={plans:[],meals:[],shopping:[]};activePlanId='';updateAccountUi();if(user)setTimeout(loadCloud,0);else render();};supabaseClient.auth.onAuthStateChange((_e,s)=>setTimeout(()=>setSession(s),0));const {data,error}=await supabaseClient.auth.getSession();if(error){accountMessage.textContent='Não foi possível verificar sua sessão.';render();return;}setSession(data.session);}
function init(){migrateLegacy();updateAccountUi();render();initAuth();}
init();
