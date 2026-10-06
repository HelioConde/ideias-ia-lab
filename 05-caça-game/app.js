const supabaseClient = window.IDEIAS_SUPABASE?.client || null;
const LOCAL_KEY = 'gameradar-alerts-v2';

const alertsEl = document.querySelector('#alerts');
const searchInput = document.querySelector('#search');
const platformFilter = document.querySelector('#platform-filter');
const statusFilter = document.querySelector('#status-filter');
const alertDialog = document.querySelector('#alert-dialog');
const alertForm = document.querySelector('#alert-form');
const alertMessage = document.querySelector('#alert-message');
const deleteAlertButton = document.querySelector('#delete-alert');
const accountDialog = document.querySelector('#account-dialog');
const accountOpen = document.querySelector('#account-open');
const accountForm = document.querySelector('#auth-form');
const accountProfile = document.querySelector('#account-profile');
const accountMessage = document.querySelector('#account-message');
const importLocalButton = document.querySelector('#import-local');
const syncStatus = document.querySelector('#sync-status');

let currentUser = null;
let cloudAlerts = [];
let integratedGames = [];
let integratedOffers = [];
let cloudLoading = false;

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
}

function makeUuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return Array.from(bytes, byte => byte.toString(16).padStart(2,'0')).join('')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

function money(cents) {
  if (cents == null || !Number.isFinite(Number(cents))) return '—';
  return (Number(cents) / 100).toLocaleString('pt-BR', {
    style:'currency', currency:'BRL'
  });
}

function cents(value) {
  const number = Number(String(value || '').replace(',','.'));
  return Number.isFinite(number) ? Math.max(0, Math.round(number * 100)) : null;
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ['http:','https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('on');
  setTimeout(() => toast.classList.remove('on'), 1800);
}

function readLocal() {
  try {
    const value = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeLocal(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items.slice(0,100)));
}

function visibleAlerts() {
  return currentUser ? cloudAlerts : readLocal();
}

function mapAlert(row) {
  return {
    id: row.id,
    title: row.title,
    targetPriceCents: row.target_price_cents == null ? null : Number(row.target_price_cents),
    platform: row.platform || '',
    notifyEnabled: Boolean(row.notify_enabled),
    lastSeenPriceCents: row.last_seen_price_cents == null ? null : Number(row.last_seen_price_cents),
    lastSeenStore: row.last_seen_store || '',
    lastSeenAt: row.last_seen_at ? Date.parse(row.last_seen_at) : null,
    storeUrl: row.store_url || '',
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at)
  };
}

function normalizeAlert(item) {
  return {
    id: item.id || makeUuid(),
    title: String(item.title || '').trim(),
    targetPriceCents: item.targetPriceCents == null ? null : Number(item.targetPriceCents),
    platform: String(item.platform || '').trim(),
    notifyEnabled: item.notifyEnabled !== false,
    lastSeenPriceCents: item.lastSeenPriceCents == null ? null : Number(item.lastSeenPriceCents),
    lastSeenStore: String(item.lastSeenStore || '').trim(),
    lastSeenAt: item.lastSeenAt ? Number(item.lastSeenAt) : null,
    storeUrl: String(item.storeUrl || '').trim(),
    createdAt: Number(item.createdAt || Date.now()),
    updatedAt: Number(item.updatedAt || Date.now())
  };
}

function alertStatus(alert) {
  if (alert.lastSeenPriceCents == null) return 'unknown';
  if (alert.targetPriceCents != null && alert.lastSeenPriceCents <= alert.targetPriceCents) return 'hit';
  return 'above';
}

function filteredAlerts() {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  return visibleAlerts().map(normalizeAlert)
    .filter(alert => !platformFilter.value || alert.platform === platformFilter.value)
    .filter(alert => !statusFilter.value || alertStatus(alert) === statusFilter.value)
    .filter(alert => {
      if (!query) return true;
      return [alert.title, alert.platform, alert.lastSeenStore]
        .some(value => String(value || '').toLocaleLowerCase('pt-BR').includes(query));
    })
    .sort((a,b) => b.updatedAt - a.updatedAt);
}

function renderMetrics() {
  const all = visibleAlerts().map(normalizeAlert);
  const hits = all.filter(alert => alertStatus(alert) === 'hit');
  const unknown = all.filter(alert => alertStatus(alert) === 'unknown');
  const gaps = all
    .filter(alert => alertStatus(alert) === 'above' && alert.targetPriceCents != null)
    .map(alert => Math.max(0, alert.lastSeenPriceCents - alert.targetPriceCents));
  const avgGap = gaps.length ? Math.round(gaps.reduce((a,b)=>a+b,0) / gaps.length) : null;

  document.querySelector('#hero-hit').textContent = String(hits.length);
  document.querySelector('#metric-total').textContent = String(all.length);
  document.querySelector('#metric-hit').textContent = String(hits.length);
  document.querySelector('#metric-unknown').textContent = String(unknown.length);
  document.querySelector('#metric-gap').textContent = avgGap == null ? '—' : money(avgGap);
}

function cardHtml(alert) {
  const status = alertStatus(alert);
  const labels = {
    hit:['No alvo','hit'],
    above:['Acima do alvo','above'],
    unknown:['Sem preço observado','unknown']
  };
  const [statusLabel,statusClass] = labels[status];
  const href = safeUrl(alert.storeUrl);
  let comparison = 'Registre um preço observado para comparar.';
  if (status === 'hit') {
    const saving = Math.max(0, alert.targetPriceCents - alert.lastSeenPriceCents);
    comparison = saving > 0
      ? 'Está ' + money(saving) + ' abaixo da sua meta.'
      : 'O preço observado chegou exatamente à sua meta.';
  } else if (status === 'above') {
    comparison = 'Precisa cair mais ' + money(alert.lastSeenPriceCents - alert.targetPriceCents) + ' para atingir sua meta.';
  }

  return '<article class="alert-card">' +
    '<div class="alert-main">' +
      '<div class="alert-title"><div><strong>' + escapeHtml(alert.title) + '</strong><span>' + escapeHtml(alert.platform || 'Sem plataforma') + '</span></div>' +
      '<span class="status ' + statusClass + '">' + statusLabel + '</span></div>' +
      '<div class="price-grid">' +
        '<div><span>Meta</span><strong>' + money(alert.targetPriceCents) + '</strong></div>' +
        '<div><span>Último preço visto</span><strong>' + money(alert.lastSeenPriceCents) + '</strong>' +
          (alert.lastSeenStore ? '<small>' + escapeHtml(alert.lastSeenStore) + '</small>' : '') + '</div>' +
      '</div>' +
      '<p class="comparison">' + escapeHtml(comparison) + '</p>' +
      (alert.lastSeenAt ? '<small class="updated">Atualizado manualmente em ' + new Date(alert.lastSeenAt).toLocaleString('pt-BR') + '</small>' : '') +
    '</div>' +
    '<div class="alert-actions">' +
      (href ? '<a class="button ghost" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">Abrir página ↗</a>' : '') +
      '<button class="button ghost" type="button" data-edit="' + escapeHtml(alert.id) + '">Atualizar</button>' +
    '</div>' +
  '</article>';
}

function renderAlerts() {
  const items = filteredAlerts();
  alertsEl.innerHTML = items.length
    ? items.map(cardHtml).join('')
    : '<div class="empty-box"><strong>Nenhum alerta encontrado.</strong><span>Adicione um jogo ou altere os filtros.</span></div>';
  renderMetrics();
}

function renderIntegratedOffers() {
  const section = document.querySelector('#integrated-section');
  const list = document.querySelector('#integrated-offers');

  if (!integratedOffers.length) {
    section.hidden = true;
    return;
  }

  const gameMap = new Map(integratedGames.map(game => [game.id, game]));
  const rows = integratedOffers
    .map(offer => ({ offer, game: gameMap.get(offer.game_id) }))
    .filter(row => row.game)
    .sort((a,b) => Number(a.offer.price_cents) - Number(b.offer.price_cents));

  if (!rows.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  const newest = Math.max(...rows.map(row => Date.parse(row.offer.checked_at)));
  document.querySelector('#integrated-note').textContent = 'Última atualização recebida: ' + new Date(newest).toLocaleString('pt-BR');

  list.innerHTML = rows.map(({offer,game}) => {
    const href = safeUrl(offer.url);
    const discount = offer.original_price_cents && offer.original_price_cents > offer.price_cents
      ? Math.round((1 - offer.price_cents / offer.original_price_cents) * 100)
      : null;
    return '<article class="offer-card">' +
      '<div><strong>' + escapeHtml(game.title) + '</strong><span>' + escapeHtml(game.platform || '') + ' · ' + escapeHtml(offer.store) + '</span></div>' +
      '<div class="offer-price"><strong>' + money(offer.price_cents) + '</strong>' +
        (discount ? '<small>−' + discount + '%</small>' : '') + '</div>' +
      (href ? '<a class="button ghost" href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer">Ver oferta ↗</a>' : '') +
    '</article>';
  }).join('');
}

async function loadIntegratedOffers() {
  if (!supabaseClient) return;
  const [gamesResult,offersResult] = await Promise.all([
    supabaseClient.from('gameradar_games').select('*').eq('active',true).order('title'),
    supabaseClient.from('gameradar_offers').select('*').eq('active',true).order('checked_at',{ascending:false}).limit(80)
  ]);
  if (!gamesResult.error) integratedGames = gamesResult.data || [];
  if (!offersResult.error) integratedOffers = offersResult.data || [];
  renderIntegratedOffers();
}

function resetAlertForm() {
  alertForm.reset();
  alertForm.elements.id.value = '';
  alertForm.elements.platform.value = 'PC';
  alertForm.elements.notifyEnabled.checked = true;
  deleteAlertButton.hidden = true;
  alertMessage.textContent = '';
  document.querySelector('#alert-title').textContent = 'Adicionar jogo';
}

function openNewAlert() {
  resetAlertForm();
  alertDialog.showModal();
  setTimeout(() => alertForm.elements.title.focus(), 30);
}

function openEditAlert(id) {
  const alert = visibleAlerts().map(normalizeAlert).find(item => item.id === id);
  if (!alert) return;
  alertForm.elements.id.value = alert.id;
  alertForm.elements.title.value = alert.title;
  alertForm.elements.platform.value = alert.platform || 'PC';
  alertForm.elements.targetPrice.value = alert.targetPriceCents == null ? '' : (alert.targetPriceCents / 100).toFixed(2);
  alertForm.elements.lastSeenPrice.value = alert.lastSeenPriceCents == null ? '' : (alert.lastSeenPriceCents / 100).toFixed(2);
  alertForm.elements.lastSeenStore.value = alert.lastSeenStore;
  alertForm.elements.storeUrl.value = alert.storeUrl;
  alertForm.elements.notifyEnabled.checked = alert.notifyEnabled;
  deleteAlertButton.hidden = false;
  alertMessage.textContent = '';
  document.querySelector('#alert-title').textContent = 'Atualizar alerta';
  alertDialog.showModal();
}

function formAlert(existing = null) {
  const values = Object.fromEntries(new FormData(alertForm));
  const now = Date.now();
  const lastSeenPriceCents = cents(values.lastSeenPrice);
  return normalizeAlert({
    ...(existing || {}),
    id: existing?.id || makeUuid(),
    title: values.title,
    platform: values.platform,
    targetPriceCents: cents(values.targetPrice),
    lastSeenPriceCents,
    lastSeenStore: values.lastSeenStore,
    storeUrl: values.storeUrl,
    notifyEnabled: alertForm.elements.notifyEnabled.checked,
    lastSeenAt: lastSeenPriceCents == null ? existing?.lastSeenAt || null : now,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  });
}

async function saveCloudAlert(alert) {
  const payload = {
    id: alert.id,
    user_id: currentUser.id,
    title: alert.title,
    target_price_cents: alert.targetPriceCents,
    platform: alert.platform || null,
    notify_enabled: alert.notifyEnabled,
    last_seen_price_cents: alert.lastSeenPriceCents,
    last_seen_store: alert.lastSeenStore || null,
    last_seen_at: alert.lastSeenAt ? new Date(alert.lastSeenAt).toISOString() : null,
    store_url: alert.storeUrl || null,
    created_at: new Date(alert.createdAt).toISOString(),
    updated_at: new Date(alert.updatedAt).toISOString()
  };
  const { data,error } = await supabaseClient
    .from('gameradar_custom_alerts')
    .upsert(payload,{onConflict:'id'})
    .select('*')
    .single();
  if (error) throw error;
  return mapAlert(data);
}

async function persistAlert(alert) {
  if (currentUser && supabaseClient) {
    const saved = await saveCloudAlert(alert);
    cloudAlerts = [saved,...cloudAlerts.filter(item=>item.id!==saved.id)];
  } else {
    const local = readLocal().map(normalizeAlert);
    const index = local.findIndex(item => item.id === alert.id);
    if (index >= 0) local[index] = alert;
    else local.unshift(alert);
    writeLocal(local);
  }
  renderAlerts();
}

async function removeAlert(id) {
  if (currentUser && supabaseClient) {
    const { error } = await supabaseClient.from('gameradar_custom_alerts').delete().eq('id',id);
    if (error) throw error;
    cloudAlerts = cloudAlerts.filter(item=>item.id!==id);
  } else {
    writeLocal(readLocal().map(normalizeAlert).filter(item=>item.id!==id));
  }
  renderAlerts();
}

async function loadCloudAlerts() {
  if (!currentUser) return;
  cloudLoading = true;
  updateAccountUi();
  const owner = currentUser.id;
  const { data,error } = await supabaseClient
    .from('gameradar_custom_alerts')
    .select('*')
    .order('updated_at',{ascending:false})
    .limit(100);
  cloudLoading = false;
  if (currentUser?.id !== owner) return;
  if (error) {
    accountMessage.textContent = 'Não foi possível carregar seus alertas.';
    updateAccountUi();
    return;
  }
  cloudAlerts = (data || []).map(mapAlert);
  renderAlerts();
  updateAccountUi();
}

function authErrorText(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (message.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (message.includes('already registered')) return 'Este e-mail já possui conta.';
  if (message.includes('password should be at least')) return 'Use uma senha com pelo menos 8 caracteres.';
  return 'Não foi possível concluir. Confira os dados e tente novamente.';
}

function updateAccountUi() {
  accountOpen.disabled = !supabaseClient;
  accountOpen.textContent = currentUser ? 'Minha conta' : 'Entrar / sincronizar';
  syncStatus.textContent = currentUser
    ? (cloudLoading ? 'Sincronizando…' : 'Nuvem · ' + (currentUser.email || 'conectado'))
    : (supabaseClient ? 'Modo local' : 'Modo local · nuvem indisponível');

  accountForm.hidden = Boolean(currentUser) || !supabaseClient;
  accountProfile.hidden = !currentUser;
  if (currentUser) {
    document.querySelector('#account-email').textContent = currentUser.email || 'Conta conectada';
    importLocalButton.hidden = readLocal().length === 0;
  }
}

async function importLocalAlerts() {
  if (!currentUser) return;
  const local = readLocal().map(normalizeAlert);
  if (!local.length) return;
  importLocalButton.disabled = true;
  accountMessage.textContent = 'Importando alertas deste dispositivo…';
  try {
    for (const alert of local) {
      await saveCloudAlert(alert);
    }
    localStorage.removeItem(LOCAL_KEY);
    await loadCloudAlerts();
    accountMessage.textContent = 'Importação concluída.';
    importLocalButton.hidden = true;
  } catch (error) {
    console.error(error);
    accountMessage.textContent = 'Não foi possível importar tudo. Os alertas locais foram preservados.';
  } finally {
    importLocalButton.disabled = false;
  }
}

function migrateLegacyLocal() {
  if (readLocal().length) return;
  try {
    const legacy = JSON.parse(localStorage.getItem('ideias-plus-05-caça-game') || '[]');
    if (!Array.isArray(legacy) || !legacy.length) return;
    const migrated = legacy.map(entry => {
      const parts = String(entry.meta || '').split(' · ');
      const target = Number(String(parts[0] || '').replace(/[^0-9.,]/g,'').replace(',','.'));
      return normalizeAlert({
        id: makeUuid(),
        title: entry.title || '',
        platform: parts[1] || 'PC',
        targetPriceCents: Number.isFinite(target) ? Math.round(target * 100) : null,
        notifyEnabled: true,
        createdAt: Number(entry.time || Date.now()),
        updatedAt: Number(entry.time || Date.now())
      });
    }).filter(item => item.title && item.targetPriceCents != null);
    if (migrated.length) writeLocal(migrated);
  } catch {
    // Preserva o histórico antigo se não for possível migrar.
  }
}

document.querySelector('#new-alert').addEventListener('click',openNewAlert);
document.querySelector('#alert-close').addEventListener('click',()=>alertDialog.close());
alertDialog.addEventListener('click',event=>{ if(event.target===alertDialog) alertDialog.close(); });

alertForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!alertForm.reportValidity()) return;
  const id=alertForm.elements.id.value;
  const existing=id?visibleAlerts().map(normalizeAlert).find(item=>item.id===id):null;
  const alert=formAlert(existing || null);
  const submit=alertForm.querySelector('[type="submit"]');
  submit.disabled=true;
  alertMessage.textContent=currentUser?'Salvando na nuvem…':'Salvando neste dispositivo…';
  try{
    await persistAlert(alert);
    alertDialog.close();
    showToast(existing?'Alerta atualizado.':'Alerta criado.');
  }catch(error){
    console.error(error);
    alertMessage.textContent='Não foi possível salvar o alerta.';
  }finally{submit.disabled=false;}
});

deleteAlertButton.addEventListener('click',async()=>{
  const id=alertForm.elements.id.value;
  if(!id || !window.confirm('Excluir este alerta?')) return;
  deleteAlertButton.disabled=true;
  try{
    await removeAlert(id);
    alertDialog.close();
    showToast('Alerta excluído.');
  }catch(error){
    console.error(error);
    alertMessage.textContent='Não foi possível excluir.';
  }finally{deleteAlertButton.disabled=false;}
});

alertsEl.addEventListener('click',event=>{
  const edit=event.target.closest('[data-edit]');
  if(edit) openEditAlert(edit.dataset.edit);
});
searchInput.addEventListener('input',renderAlerts);
platformFilter.addEventListener('change',renderAlerts);
statusFilter.addEventListener('change',renderAlerts);

accountOpen.addEventListener('click',()=>accountDialog.showModal());
document.querySelector('#account-close').addEventListener('click',()=>accountDialog.close());
accountDialog.addEventListener('click',event=>{if(event.target===accountDialog) accountDialog.close();});

accountForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!supabaseClient) return;
  const submit=accountForm.querySelector('[type="submit"]');
  submit.disabled=true;
  accountMessage.textContent='Entrando…';
  try{
    const {error}=await supabaseClient.auth.signInWithPassword({
      email:accountForm.elements.email.value.trim(),
      password:accountForm.elements.password.value
    });
    if(error) throw error;
    accountMessage.textContent='Conta conectada.';
  }catch(error){accountMessage.textContent=authErrorText(error);}
  finally{submit.disabled=false;}
});

document.querySelector('#sign-up').addEventListener('click',async()=>{
  if(!supabaseClient) return;
  const email=accountForm.elements.email.value.trim();
  const password=accountForm.elements.password.value;
  if(!email || password.length<8){
    accountMessage.textContent='Informe um e-mail e uma senha com pelo menos 8 caracteres.';
    return;
  }
  const button=document.querySelector('#sign-up');
  button.disabled=true;
  accountMessage.textContent='Criando conta…';
  try{
    const {data,error}=await supabaseClient.auth.signUp({email,password});
    if(error) throw error;
    accountMessage.textContent=data.session?'Conta criada e conectada.':'Conta criada. Confirme seu e-mail e depois entre.';
  }catch(error){accountMessage.textContent=authErrorText(error);}
  finally{button.disabled=false;}
});

document.querySelector('#reset-password').addEventListener('click',async()=>{
  if(!supabaseClient) return;
  const email=accountForm.elements.email.value.trim();
  if(!email){accountMessage.textContent='Informe seu e-mail primeiro.';return;}
  try{
    const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.href.split('#')[0]});
    if(error) throw error;
    accountMessage.textContent='Se o e-mail estiver cadastrado, enviaremos um link de recuperação.';
  }catch(error){accountMessage.textContent=authErrorText(error);}
});

document.querySelector('#sign-out').addEventListener('click',async()=>{
  if(!supabaseClient) return;
  const {error}=await supabaseClient.auth.signOut();
  accountMessage.textContent=error?'Não foi possível sair.':'Você saiu da conta.';
});
importLocalButton.addEventListener('click',importLocalAlerts);

async function initAuth(){
  if(!supabaseClient){updateAccountUi();renderAlerts();return;}
  let activeUserId=null;
  const setSession=session=>{
    const user=session?.user||null;
    if(user?.id===activeUserId) return;
    activeUserId=user?.id||null;
    currentUser=user;
    cloudAlerts=[];
    updateAccountUi();
    if(user) setTimeout(loadCloudAlerts,0);
    else renderAlerts();
  };
  supabaseClient.auth.onAuthStateChange((_event,session)=>setTimeout(()=>setSession(session),0));
  const {data,error}=await supabaseClient.auth.getSession();
  if(error){
    accountMessage.textContent='Não foi possível verificar sua sessão. O modo local continua disponível.';
    renderAlerts();
    return;
  }
  setSession(data.session);
}

async function init(){
  migrateLegacyLocal();
  renderAlerts();
  updateAccountUi();
  await loadIntegratedOffers();
  await initAuth();
}
init();
