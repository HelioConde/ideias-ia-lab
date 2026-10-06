const supabaseClient=window.IDEIAS_SUPABASE?.client||null;

const resultsEl=document.querySelector('#results');
const cityInput=document.querySelector('#city');
const stateSelect=document.querySelector('#state');
const categorySelect=document.querySelector('#category');
const termInput=document.querySelector('#term');
const requestDialog=document.querySelector('#request-dialog');
const requestForm=document.querySelector('#request-form');
const requestMessage=document.querySelector('#request-message');
const profileDialog=document.querySelector('#profile-dialog');
const profileForm=document.querySelector('#profile-form');
const profileMessage=document.querySelector('#profile-message');
const profileBox=document.querySelector('#professional-profile');
const requestList=document.querySelector('#request-list');
const accountDialog=document.querySelector('#account-dialog');
const accountOpen=document.querySelector('#account-open');
const accountForm=document.querySelector('#auth-form');
const accountProfile=document.querySelector('#account-profile');
const accountMessage=document.querySelector('#account-message');
const syncStatus=document.querySelector('#sync-status');

let currentUser=null;
let currentProfile=null;
let userRequests=[];
let searchResults=[];
let pendingRequestProfessionalId='';
let loadingAccount=false;

function escapeHtml(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function money(cents){return cents==null?'Consultar':(Number(cents)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function showToast(message){const t=document.querySelector('#toast');t.textContent=message;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1800);}
function statusLabel(status){return{pending:'Em análise',active:'Ativo',paused:'Pausado',rejected:'Não aprovado'}[status]||status;}
function requestStatusLabel(status){return{new:'Novo',viewed:'Visualizado',contacted:'Contato realizado',closed:'Encerrado',cancelled:'Cancelado'}[status]||status;}
function safeText(value,max=180){return String(value||'').trim().slice(0,max);}
function normalize(value){return String(value||'').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{M}/gu,'');}

async function loadActiveCount(){
  if(!supabaseClient)return;
  const {count,error}=await supabaseClient.from('perto_professionals').select('id',{count:'exact',head:true}).eq('status','active');
  if(!error)document.querySelector('#hero-count').textContent=String(count||0);
}

function professionalCard(profile){
  const rating=profile.rating==null?'<span class="rating new">Novo no Perto</span>':'<span class="rating">★ '+Number(profile.rating).toFixed(1)+'</span>';
  return '<article class="professional-card">'+
    '<div class="professional-top"><div><strong>'+escapeHtml(profile.display_name)+'</strong><span>'+escapeHtml(profile.category)+'</span></div>'+rating+'</div>'+
    '<p>'+escapeHtml(profile.description||'')+'</p>'+
    '<div class="professional-meta"><span>⌖ '+escapeHtml(profile.city)+'/'+escapeHtml(profile.state)+'</span><span>A partir de '+escapeHtml(money(profile.price_from_cents))+'</span></div>'+
    '<button class="button primary full" type="button" data-request="'+escapeHtml(profile.id)+'">Pedir orçamento</button>'+
  '</article>';
}

function renderResults(){
  resultsEl.innerHTML=searchResults.length
    ?searchResults.map(professionalCard).join('')
    :'<div class="empty-box"><strong>Nenhum profissional ativo encontrado.</strong><span>Isso significa que não há perfil aprovado para esses filtros agora — não exibimos prestadores fictícios.</span></div>';
  document.querySelector('#result-summary').textContent=searchResults.length
    ?searchResults.length+' profissional(is) ativo(s) encontrado(s).'
    :'Nenhum resultado ativo para os filtros informados.';
}

async function searchProfessionals(){
  if(!supabaseClient){showToast('Busca temporariamente indisponível.');return;}
  const button=document.querySelector('#search-button');button.disabled=true;
  document.querySelector('#result-summary').textContent='Buscando perfis ativos…';
  try{
    let query=supabaseClient.from('perto_professionals')
      .select('id,display_name,city,state,category,description,price_from_cents,rating,status')
      .eq('status','active')
      .order('rating',{ascending:false,nullsFirst:false})
      .limit(60);
    const city=safeText(cityInput.value,100);
    if(city)query=query.ilike('city','%'+city+'%');
    if(stateSelect.value)query=query.eq('state',stateSelect.value);
    if(categorySelect.value)query=query.ilike('category','%'+categorySelect.value+'%');
    const {data,error}=await query;if(error)throw error;
    const term=normalize(termInput.value);
    searchResults=(data||[]).filter(profile=>{
      if(!term)return true;
      return [profile.display_name,profile.category,profile.description].some(v=>normalize(v).includes(term));
    });
    renderResults();
  }catch(error){console.error(error);searchResults=[];resultsEl.innerHTML='<div class="empty-box error"><strong>Não foi possível concluir a busca.</strong><span>Tente novamente.</span></div>';document.querySelector('#result-summary').textContent='Falha na busca.';}
  finally{button.disabled=false;}
}

function openRequest(profileId){
  const profile=searchResults.find(item=>item.id===profileId);
  if(!profile)return;
  if(!currentUser){pendingRequestProfessionalId=profileId;accountMessage.textContent='Entre ou crie uma conta para enviar o pedido.';accountDialog.showModal();return;}
  requestForm.reset();
  requestForm.elements.professionalId.value=profile.id;
  requestForm.elements.category.value=profile.category;
  requestForm.elements.city.value=profile.city;
  document.querySelector('#request-professional').innerHTML='<strong>'+escapeHtml(profile.display_name)+'</strong><span>'+escapeHtml(profile.category)+' · '+escapeHtml(profile.city)+'/'+escapeHtml(profile.state)+'</span>';
  requestMessage.textContent='';
  requestDialog.showModal();
}

async function sendRequest(){
  const values=Object.fromEntries(new FormData(requestForm));
  const payload={
    user_id:currentUser.id,
    professional_id:values.professionalId||null,
    category:safeText(values.category,100),
    city:safeText(values.city,100),
    message:safeText(values.message,1600),
    contact:safeText(values.contact,200),
    status:'new'
  };
  const {data,error}=await supabaseClient.from('perto_requests').insert(payload).select('*').single();
  if(error)throw error;
  userRequests.unshift(data);
}

function renderRequestList(){
  document.querySelector('#request-count').textContent=String(userRequests.length);
  if(!currentUser){
    requestList.innerHTML='<div class="empty-box compact"><strong>Entre para acompanhar pedidos.</strong><span>Os pedidos são privados.</span></div>';
    return;
  }
  requestList.innerHTML=userRequests.length?userRequests.map(request=>{
    const outgoing=request.user_id===currentUser.id;
    return '<article class="request-item">'+
      '<div><strong>'+escapeHtml(request.category)+'</strong><span>'+escapeHtml(request.city)+' · '+new Date(request.created_at).toLocaleDateString('pt-BR')+'</span></div>'+
      '<p>'+escapeHtml(request.message)+'</p>'+
      (outgoing?'':'<div class="private-contact"><span>Contato informado pelo cliente</span><strong>'+escapeHtml(request.contact||'Não informado')+'</strong></div>')+
      '<span class="request-status">'+escapeHtml(outgoing?'Enviado · '+requestStatusLabel(request.status):'Recebido · '+requestStatusLabel(request.status))+'</span>'+
      (outgoing&&request.status!=='cancelled'&&request.status!=='closed'?'<button class="button text danger-text" data-cancel-request="'+escapeHtml(request.id)+'" type="button">Cancelar pedido</button>':'')+
    '</article>';
  }).join(''):'<div class="empty-box compact"><strong>Nenhum pedido ainda.</strong><span>Escolha um profissional ativo na busca para começar.</span></div>';
}

function renderProfile(){
  if(!currentUser){
    profileBox.innerHTML='<div class="empty-box compact"><strong>Quer oferecer um serviço?</strong><span>Entre para cadastrar seu perfil profissional.</span><button class="button ghost" type="button" data-open-account>Entrar</button></div>';
    return;
  }
  if(!currentProfile){
    profileBox.innerHTML='<div class="empty-box compact"><strong>Você ainda não tem perfil profissional.</strong><span>O cadastro entra em análise antes de aparecer publicamente.</span><button class="button primary" type="button" data-create-profile>Cadastrar serviço</button></div>';
    return;
  }
  profileBox.innerHTML='<article class="my-profile">'+
    '<div class="profile-head"><div><strong>'+escapeHtml(currentProfile.display_name)+'</strong><span>'+escapeHtml(currentProfile.category)+' · '+escapeHtml(currentProfile.city)+'/'+escapeHtml(currentProfile.state)+'</span></div><span class="profile-status '+escapeHtml(currentProfile.status)+'">'+escapeHtml(statusLabel(currentProfile.status))+'</span></div>'+
    '<p>'+escapeHtml(currentProfile.description||'')+'</p>'+
    '<div class="profile-price">Preço inicial: <strong>'+escapeHtml(money(currentProfile.price_from_cents))+'</strong></div>'+
    '<button class="button ghost full" type="button" data-edit-profile>Editar informações</button>'+
    (currentProfile.status==='pending'?'<small class="moderation-note">Seu perfil ainda não aparece na busca pública. A ativação exige moderação.</small>':'')+
  '</article>';
}

function openProfileEditor(){
  if(!currentUser)return;
  profileForm.reset();
  if(currentProfile){
    profileForm.elements.displayName.value=currentProfile.display_name||'';
    profileForm.elements.city.value=currentProfile.city||'';
    profileForm.elements.state.value=currentProfile.state||'';
    profileForm.elements.category.value=currentProfile.category||'';
    profileForm.elements.description.value=currentProfile.description||'';
    profileForm.elements.priceFrom.value=currentProfile.price_from_cents==null?'':(Number(currentProfile.price_from_cents)/100).toFixed(2);
    document.querySelector('#profile-title').textContent='Editar perfil';
  }else{
    document.querySelector('#profile-title').textContent='Cadastrar serviço';
  }
  profileMessage.textContent='';
  profileDialog.showModal();
}

async function saveProfile(){
  const values=Object.fromEntries(new FormData(profileForm));
  const price=values.priceFrom===''?null:Math.round(Number(values.priceFrom)*100);
  const payload={
    user_id:currentUser.id,
    display_name:safeText(values.displayName,120),
    city:safeText(values.city,100),
    state:safeText(values.state,2).toUpperCase(),
    category:safeText(values.category,100),
    description:safeText(values.description,1200),
    price_from_cents:Number.isFinite(price)?price:null,
    updated_at:new Date().toISOString()
  };
  if(currentProfile){
    const {data,error}=await supabaseClient.from('perto_professionals').update(payload).eq('id',currentProfile.id).select('*').single();
    if(error)throw error;currentProfile=data;
  }else{
    const {data,error}=await supabaseClient.from('perto_professionals').insert({...payload,status:'pending'}).select('*').single();
    if(error)throw error;currentProfile=data;
  }
}

async function loadUserData(){
  if(!currentUser)return;
  loadingAccount=true;updateAccountUi();
  const owner=currentUser.id;
  const [profileResult,requestsResult]=await Promise.all([
    supabaseClient.from('perto_professionals').select('*').eq('user_id',currentUser.id).maybeSingle(),
    supabaseClient.from('perto_requests').select('*').order('created_at',{ascending:false}).limit(100)
  ]);
  loadingAccount=false;if(currentUser?.id!==owner)return;
  if(profileResult.error)accountMessage.textContent='Não foi possível carregar seu perfil profissional.';
  currentProfile=profileResult.data||null;
  if(requestsResult.error)accountMessage.textContent='Não foi possível carregar seus pedidos.';
  userRequests=requestsResult.data||[];
  updateAccountUi();renderProfile();renderRequestList();
}

function authErrorText(error){
  const m=String(error?.message||'').toLowerCase();
  if(m.includes('invalid login credentials'))return'E-mail ou senha incorretos.';
  if(m.includes('email not confirmed'))return'Confirme seu e-mail antes de entrar.';
  if(m.includes('already registered'))return'Este e-mail já possui conta.';
  if(m.includes('password should be at least'))return'Use uma senha com pelo menos 8 caracteres.';
  return'Não foi possível concluir. Confira os dados e tente novamente.';
}
function updateAccountUi(){
  accountOpen.disabled=!supabaseClient;accountOpen.textContent=currentUser?'Minha conta':'Entrar';
  syncStatus.textContent=currentUser?(loadingAccount?'Carregando conta…':'Conectado · '+(currentUser.email||'conta')):'Busca pública';
  accountForm.hidden=Boolean(currentUser)||!supabaseClient;accountProfile.hidden=!currentUser;
  if(currentUser)document.querySelector('#account-email').textContent=currentUser.email||'Conta conectada';
}

document.querySelector('#search-button').addEventListener('click',searchProfessionals);
[cityInput,stateSelect,categorySelect,termInput].forEach(el=>el.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();searchProfessionals();}}));
resultsEl.addEventListener('click',event=>{const b=event.target.closest('[data-request]');if(b)openRequest(b.dataset.request);});

document.querySelector('#request-close').addEventListener('click',()=>requestDialog.close());
requestDialog.addEventListener('click',e=>{if(e.target===requestDialog)requestDialog.close();});
requestForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!currentUser||!requestForm.reportValidity())return;
  const b=requestForm.querySelector('[type="submit"]');b.disabled=true;requestMessage.textContent='Enviando pedido…';
  try{await sendRequest();requestDialog.close();renderRequestList();showToast('Pedido enviado com privacidade.');}
  catch(error){console.error(error);requestMessage.textContent='Não foi possível enviar o pedido.';}
  finally{b.disabled=false;}
});

requestList.addEventListener('click',async event=>{
  const cancel=event.target.closest('[data-cancel-request]');if(!cancel)return;
  if(!window.confirm('Cancelar este pedido?'))return;
  cancel.disabled=true;
  try{
    const {data,error}=await supabaseClient.from('perto_requests').update({status:'cancelled',updated_at:new Date().toISOString()}).eq('id',cancel.dataset.cancelRequest).select('*').single();
    if(error)throw error;userRequests=userRequests.map(item=>item.id===data.id?data:item);renderRequestList();showToast('Pedido cancelado.');
  }catch(error){console.error(error);showToast('Não foi possível cancelar.');}
  finally{cancel.disabled=false;}
});

profileBox.addEventListener('click',event=>{
  if(event.target.closest('[data-create-profile]')||event.target.closest('[data-edit-profile]'))openProfileEditor();
  if(event.target.closest('[data-open-account]'))accountDialog.showModal();
});
document.querySelector('#profile-close').addEventListener('click',()=>profileDialog.close());
profileDialog.addEventListener('click',e=>{if(e.target===profileDialog)profileDialog.close();});
profileForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!currentUser||!profileForm.reportValidity())return;
  const b=profileForm.querySelector('[type="submit"]');b.disabled=true;profileMessage.textContent='Salvando perfil…';
  try{await saveProfile();profileDialog.close();renderProfile();showToast(currentProfile.status==='pending'?'Perfil salvo e enviado para análise.':'Perfil atualizado.');}
  catch(error){console.error(error);profileMessage.textContent=String(error?.message||'').includes('moderation')?'O status do perfil só pode ser alterado pela moderação.':'Não foi possível salvar o perfil.';}
  finally{b.disabled=false;}
});

accountOpen.addEventListener('click',()=>accountDialog.showModal());
document.querySelector('#account-close').addEventListener('click',()=>accountDialog.close());
accountDialog.addEventListener('click',e=>{if(e.target===accountDialog)accountDialog.close();});
accountForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!supabaseClient)return;const b=accountForm.querySelector('[type="submit"]');b.disabled=true;accountMessage.textContent='Entrando…';
  try{const {error}=await supabaseClient.auth.signInWithPassword({email:accountForm.elements.email.value.trim(),password:accountForm.elements.password.value});if(error)throw error;accountMessage.textContent='Conta conectada.';}
  catch(error){accountMessage.textContent=authErrorText(error);}finally{b.disabled=false;}
});
document.querySelector('#sign-up').addEventListener('click',async()=>{
  if(!supabaseClient)return;const email=accountForm.elements.email.value.trim(),password=accountForm.elements.password.value;
  if(!email||password.length<8){accountMessage.textContent='Informe um e-mail e uma senha com pelo menos 8 caracteres.';return;}
  const b=document.querySelector('#sign-up');b.disabled=true;accountMessage.textContent='Criando conta…';
  try{const {data,error}=await supabaseClient.auth.signUp({email,password});if(error)throw error;accountMessage.textContent=data.session?'Conta criada e conectada.':'Conta criada. Confirme seu e-mail e depois entre.';}
  catch(error){accountMessage.textContent=authErrorText(error);}finally{b.disabled=false;}
});
document.querySelector('#reset-password').addEventListener('click',async()=>{
  if(!supabaseClient)return;const email=accountForm.elements.email.value.trim();if(!email){accountMessage.textContent='Informe seu e-mail primeiro.';return;}
  try{const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.href.split('#')[0]});if(error)throw error;accountMessage.textContent='Se o e-mail estiver cadastrado, enviaremos um link de recuperação.';}
  catch(error){accountMessage.textContent=authErrorText(error);}
});
document.querySelector('#sign-out').addEventListener('click',async()=>{if(!supabaseClient)return;const {error}=await supabaseClient.auth.signOut();accountMessage.textContent=error?'Não foi possível sair.':'Você saiu da conta.';});

async function initAuth(){
  if(!supabaseClient){updateAccountUi();renderProfile();renderRequestList();return;}
  let activeUserId=null;
  const setSession=session=>{
    const user=session?.user||null;if(user?.id===activeUserId)return;activeUserId=user?.id||null;currentUser=user;currentProfile=null;userRequests=[];updateAccountUi();
    if(user){
      setTimeout(async()=>{await loadUserData();if(pendingRequestProfessionalId){const id=pendingRequestProfessionalId;pendingRequestProfessionalId='';accountDialog.close();openRequest(id);}},0);
    }else{renderProfile();renderRequestList();}
  };
  supabaseClient.auth.onAuthStateChange((_e,s)=>setTimeout(()=>setSession(s),0));
  const {data,error}=await supabaseClient.auth.getSession();if(error){accountMessage.textContent='Não foi possível verificar a sessão.';renderProfile();renderRequestList();return;}setSession(data.session);
}

async function init(){
  updateAccountUi();renderProfile();renderRequestList();
  await loadActiveCount();
  searchResults=[];resultsEl.innerHTML='<div class="empty-box"><strong>Busque por cidade ou categoria.</strong><span>Somente perfis ativos e aprovados serão exibidos.</span></div>';
  await initAuth();
}
init();
