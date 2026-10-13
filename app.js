const supabaseClient=window.IDEIAS_SUPABASE?.client||null;
const T=(key,vars)=>window.PERTO_I18N?.t(key,vars)||key;
const locale=()=>window.PERTO_I18N?.lang||'pt-BR';

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
function money(cents){return cents==null?T('consult'):(Number(cents)/100).toLocaleString(locale(),{style:'currency',currency:'BRL'});}
function showToast(message){const t=document.querySelector('#toast');t.textContent=message;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1800);}
function statusLabel(status){return T(({pending:'statePending',active:'stateActive',paused:'statePaused',rejected:'stateRejected'})[status]||status);}
function requestStatusLabel(status){return T(({new:'quoteNew',viewed:'quoteViewed',contacted:'quoteContacted',closed:'quoteClosed',cancelled:'quoteCancelled'})[status]||status);}
function safeText(value,max=180){return String(value||'').trim().slice(0,max);}
function normalize(value){return String(value||'').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{M}/gu,'');}

async function loadActiveCount(){
  if(!supabaseClient)return;
  const {count,error}=await supabaseClient.from('perto_professionals').select('id',{count:'exact',head:true}).eq('status','active');
  if(!error)document.querySelector('#hero-count').textContent=String(count||0);
}

function professionalCard(profile){
  const rating=profile.rating==null?'<span class="rating new">'+escapeHtml(T('ratingNew'))+'</span>':'<span class="rating">★ '+Number(profile.rating).toFixed(1)+'</span>';
  return '<article class="professional-card">'+
    '<div class="professional-top"><div><strong>'+escapeHtml(profile.display_name)+'</strong><span>'+escapeHtml(profile.category)+'</span></div>'+rating+'</div>'+
    '<p>'+escapeHtml(profile.description||'')+'</p>'+
    '<div class="professional-meta"><span>⌖ '+escapeHtml(profile.city)+'/'+escapeHtml(profile.state)+'</span><span>'+escapeHtml(T('from'))+' '+escapeHtml(money(profile.price_from_cents))+'</span></div>'+
    '<button class="button primary full" type="button" data-request="'+escapeHtml(profile.id)+'">'+escapeHtml(T('requestQuote'))+'</button>'+
  '</article>';
}

function renderResults(){
  resultsEl.innerHTML=searchResults.length
    ?searchResults.map(professionalCard).join('')
    :'<div class="empty-box"><strong>'+escapeHtml(T('noProfessionals'))+'</strong><span>'+escapeHtml(T('noProfessionalsHelp'))+'</span></div>';
  document.querySelector('#result-summary').textContent=searchResults.length
    ?T('professionalsFound',{count:searchResults.length})
    :T('noResults');
}

async function searchProfessionals(){
  if(!supabaseClient){showToast(T('searchUnavailable'));return;}
  const button=document.querySelector('#search-button');button.disabled=true;
  document.querySelector('#result-summary').textContent=T('searching');
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
  }catch(error){console.error(error);searchResults=[];resultsEl.innerHTML='<div class="empty-box error"><strong>'+escapeHtml(T('searchFailedTitle'))+'</strong><span>'+escapeHtml(T('tryAgain'))+'</span></div>';document.querySelector('#result-summary').textContent=T('searchFailed');}
  finally{button.disabled=false;}
}

function openRequest(profileId){
  const profile=searchResults.find(item=>item.id===profileId);
  if(!profile)return;
  if(!currentUser){pendingRequestProfessionalId=profileId;accountMessage.textContent=T('mustLogin');accountDialog.showModal();return;}
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
    contact:safeText(values.contact,200)
  };
  const {data,error}=await supabaseClient.from('perto_requests').insert(payload).select('*').single();
  if(error)throw error;
  userRequests.unshift(data);
}

function renderRequestList(){
  document.querySelector('#request-count').textContent=String(userRequests.length);
  if(!currentUser){
    requestList.innerHTML='<div class="empty-box compact"><strong>'+escapeHtml(T('noLoginRequests'))+'</strong><span>'+escapeHtml(T('privateRequests'))+'</span></div>';
    return;
  }
  requestList.innerHTML=userRequests.length?userRequests.map(request=>{
    const outgoing=request.user_id===currentUser.id;
    return '<article class="request-item">'+
      '<div><strong>'+escapeHtml(request.category)+'</strong><span>'+escapeHtml(request.city)+' · '+new Date(request.created_at).toLocaleDateString(locale())+'</span></div>'+
      '<p>'+escapeHtml(request.message)+'</p>'+
      (outgoing?'':'<div class="private-contact"><span>'+escapeHtml(T('contactProvided'))+'</span><strong>'+escapeHtml(request.contact||T('notProvided'))+'</strong></div>')+
      '<span class="request-status">'+escapeHtml(outgoing?T('sent')+' · '+requestStatusLabel(request.status):T('received')+' · '+requestStatusLabel(request.status))+'</span>'+
      (outgoing&&request.status!=='cancelled'&&request.status!=='closed'?'<button class="button text danger-text" data-cancel-request="'+escapeHtml(request.id)+'" type="button">'+escapeHtml(T('cancelQuote'))+'</button>':'')+
    '</article>';
  }).join(''):'<div class="empty-box compact"><strong>'+escapeHtml(T('noRequests'))+'</strong><span>'+escapeHtml(T('noRequestsHelp'))+'</span></div>';
}

function renderProfile(){
  if(!currentUser){
    profileBox.innerHTML='<div class="empty-box compact"><strong>'+escapeHtml(T('offerService'))+'</strong><span>'+escapeHtml(T('loginForProfile'))+'</span><button class="button ghost" type="button" data-open-account>'+escapeHtml(T('signIn'))+'</button></div>';
    return;
  }
  if(!currentProfile){
    profileBox.innerHTML='<div class="empty-box compact"><strong>'+escapeHtml(T('noProfile'))+'</strong><span>'+escapeHtml(T('profilePendingHelp'))+'</span><button class="button primary" type="button" data-create-profile>'+escapeHtml(T('createProfile'))+'</button></div>';
    return;
  }
  profileBox.innerHTML='<article class="my-profile">'+
    '<div class="profile-head"><div><strong>'+escapeHtml(currentProfile.display_name)+'</strong><span>'+escapeHtml(currentProfile.category)+' · '+escapeHtml(currentProfile.city)+'/'+escapeHtml(currentProfile.state)+'</span></div><span class="profile-status '+escapeHtml(currentProfile.status)+'">'+escapeHtml(statusLabel(currentProfile.status))+'</span></div>'+
    '<p>'+escapeHtml(currentProfile.description||'')+'</p>'+
    '<div class="profile-price">'+escapeHtml(T('profileCost'))+' <strong>'+escapeHtml(money(currentProfile.price_from_cents))+'</strong></div>'+
    '<button class="button ghost full" type="button" data-edit-profile>'+escapeHtml(T('editProfile'))+'</button>'+
    (currentProfile.status==='pending'?'<small class="moderation-note">'+escapeHtml(T('awaitingModeration'))+'</small>':'')+
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
    document.querySelector('#profile-title').textContent=T('editProfile');
  }else{
    document.querySelector('#profile-title').textContent=T('createProfile');
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
    const {data,error}=await supabaseClient.from('perto_professionals').update(payload).eq('id',currentProfile.id).select('id,user_id,display_name,city,state,category,description,price_from_cents,rating,status,created_at,updated_at').single();
    if(error)throw error;currentProfile=data;
  }else{
    const {data,error}=await supabaseClient.from('perto_professionals').insert(payload).select('id,user_id,display_name,city,state,category,description,price_from_cents,rating,status,created_at,updated_at').single();
    if(error)throw error;currentProfile=data;
  }
}

async function loadUserData(){
  if(!currentUser)return;
  loadingAccount=true;updateAccountUi();
  const owner=currentUser.id;
  const [profileResult,requestsResult]=await Promise.all([
    supabaseClient.from('perto_professionals').select('id,user_id,display_name,city,state,category,description,price_from_cents,rating,status,created_at,updated_at').eq('user_id',currentUser.id).maybeSingle(),
    supabaseClient.from('perto_requests').select('*').order('created_at',{ascending:false}).limit(100)
  ]);
  loadingAccount=false;if(currentUser?.id!==owner)return;
  if(profileResult.error)accountMessage.textContent=T('loadProfileFailed');
  currentProfile=profileResult.data||null;
  if(requestsResult.error)accountMessage.textContent=T('loadRequestsFailed');
  userRequests=requestsResult.data||[];
  updateAccountUi();renderProfile();renderRequestList();
}

function authErrorText(error){
  const m=String(error?.message||'').toLowerCase();
  if(m.includes('invalid login credentials'))return T('invalidCredentials');
  if(m.includes('email not confirmed'))return T('emailNotConfirmed');
  if(m.includes('already registered'))return T('emailAlready');
  if(m.includes('password should be at least'))return T('shortPassword');
  return T('authError');
}
function updateAccountUi(){
  accountOpen.disabled=!supabaseClient;accountOpen.textContent=currentUser?T('myAccount'):T('signIn');
  syncStatus.textContent=currentUser?(loadingAccount?T('loadingAccount'):T('connected')+' · '+(currentUser.email||T('myAccount'))):T('searchStatus');
  accountForm.hidden=Boolean(currentUser)||!supabaseClient;accountProfile.hidden=!currentUser;
  if(currentUser)document.querySelector('#account-email').textContent=currentUser.email||T('accountConnected');
}

document.querySelector('#search-button').addEventListener('click',searchProfessionals);
[cityInput,stateSelect,categorySelect,termInput].forEach(el=>el.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();searchProfessionals();}}));
resultsEl.addEventListener('click',event=>{const b=event.target.closest('[data-request]');if(b)openRequest(b.dataset.request);});

document.querySelector('#request-close').addEventListener('click',()=>requestDialog.close());
requestDialog.addEventListener('click',e=>{if(e.target===requestDialog)requestDialog.close();});
requestForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!currentUser||!requestForm.reportValidity())return;
  const b=requestForm.querySelector('[type="submit"]');b.disabled=true;requestMessage.textContent=T('sending');
  try{await sendRequest();requestDialog.close();renderRequestList();showToast(T('quoteSent'));}
  catch(error){console.error(error);requestMessage.textContent=T('quoteFailed');}
  finally{b.disabled=false;}
});

requestList.addEventListener('click',async event=>{
  const cancel=event.target.closest('[data-cancel-request]');if(!cancel)return;
  if(!window.confirm(T('confirmCancel')))return;
  cancel.disabled=true;
  try{
    const {data,error}=await supabaseClient.from('perto_requests').update({status:'cancelled',updated_at:new Date().toISOString()}).eq('id',cancel.dataset.cancelRequest).eq('user_id',currentUser.id).select('*').single();
    if(error)throw error;userRequests=userRequests.map(item=>item.id===data.id?data:item);renderRequestList();showToast(T('cancelled'));
  }catch(error){console.error(error);showToast(T('cancelFailed'));}
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
  const b=profileForm.querySelector('[type="submit"]');b.disabled=true;profileMessage.textContent=T('savingProfile');
  try{await saveProfile();profileDialog.close();renderProfile();showToast(currentProfile.status==='pending'?T('profileSaved'):T('profileUpdated'));}
  catch(error){console.error(error);profileMessage.textContent=String(error?.message||'').includes('moderation')?T('profileModerationError'):T('profileSaveError');}
  finally{b.disabled=false;}
});

accountOpen.addEventListener('click',()=>accountDialog.showModal());
document.querySelector('#account-close').addEventListener('click',()=>accountDialog.close());
accountDialog.addEventListener('click',e=>{if(e.target===accountDialog)accountDialog.close();});
accountForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!supabaseClient)return;const b=accountForm.querySelector('[type="submit"]');b.disabled=true;accountMessage.textContent=T('signingIn');
  try{const {error}=await supabaseClient.auth.signInWithPassword({email:accountForm.elements.email.value.trim(),password:accountForm.elements.password.value});if(error)throw error;accountMessage.textContent=T('accountConnected');}
  catch(error){accountMessage.textContent=authErrorText(error);}finally{b.disabled=false;}
});
document.querySelector('#sign-up').addEventListener('click',async()=>{
  if(!supabaseClient)return;const email=accountForm.elements.email.value.trim(),password=accountForm.elements.password.value;
  if(!email||password.length<8){accountMessage.textContent=T('signupInvalid');return;}
  const b=document.querySelector('#sign-up');b.disabled=true;accountMessage.textContent=T('creatingAccount');
  try{const {data,error}=await supabaseClient.auth.signUp({email,password});if(error)throw error;accountMessage.textContent=data.session?T('accountCreated'):T('confirmEmail');}
  catch(error){accountMessage.textContent=authErrorText(error);}finally{b.disabled=false;}
});
document.querySelector('#reset-password').addEventListener('click',async()=>{
  if(!supabaseClient)return;const email=accountForm.elements.email.value.trim();if(!email){accountMessage.textContent=T('emailRequired');return;}
  try{const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.href.split('#')[0]});if(error)throw error;accountMessage.textContent=T('resetSent');}
  catch(error){accountMessage.textContent=authErrorText(error);}
});
document.querySelector('#sign-out').addEventListener('click',async()=>{if(!supabaseClient)return;const {error}=await supabaseClient.auth.signOut();accountMessage.textContent=error?T('signOutError'):T('signedOut');});

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
  const {data,error}=await supabaseClient.auth.getSession();if(error){accountMessage.textContent=T('sessionError');renderProfile();renderRequestList();return;}setSession(data.session);
}

async function init(){
  updateAccountUi();renderProfile();renderRequestList();
  await loadActiveCount();
  searchResults=[];resultsEl.innerHTML='<div class="empty-box"><strong>'+escapeHtml(T('initialSearch'))+'</strong><span>'+escapeHtml(T('onlyApproved'))+'</span></div>';
  await initAuth();
}
init();

// Language changes preserve filters, session and user-supplied content.
window.addEventListener('perto:language-change',()=>{
  updateAccountUi();
  renderProfile();
  renderRequestList();
  if(searchResults.length)renderResults();
  else if(resultsEl.querySelector('.empty-box') && resultsEl.textContent.includes('Busque por cidade ou categoria.')){
    resultsEl.innerHTML='<div class="empty-box"><strong>'+escapeHtml(T('initialSearch'))+'</strong><span>'+escapeHtml(T('onlyApproved'))+'</span></div>';
  } else if(resultsEl.querySelector('.empty-box') && resultsEl.textContent.includes('Search by city or category.')){
    resultsEl.innerHTML='<div class="empty-box"><strong>'+escapeHtml(T('initialSearch'))+'</strong><span>'+escapeHtml(T('onlyApproved'))+'</span></div>';
  }
});
