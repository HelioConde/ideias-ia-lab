const supabaseClient = window.IDEIAS_SUPABASE?.client || null;
const LOCAL_KEY = 'falapro-data-v2';

const QUESTION_BANK = {
  general: [
    { q:'Tell me about yourself.', hint:'Focus on your current profile, relevant experience, and what you are looking for next.' },
    { q:'Why are you interested in this role?', hint:'Connect your skills and goals to the role instead of only praising the company.' },
    { q:'Tell me about a challenge you faced and how you handled it.', hint:'Use a real example and explain your action and the result.' },
    { q:'Describe a time you worked with other people to solve a problem.', hint:'Show communication, your contribution, and the outcome.' },
    { q:'What is one strength you would bring to this team?', hint:'Name the strength and prove it with a short example.' }
  ],
  frontend: [
    { q:'Tell me about a front-end project you are proud of.', hint:'Explain the problem, stack, your decisions, and the result.' },
    { q:'How do you decide when to use local state, context, or another state management solution?', hint:'Compare scope, complexity, and maintainability.' },
    { q:'How would you improve the performance of a slow web page?', hint:'Mention measurement first, then concrete improvements.' },
    { q:'How do you make a user interface accessible?', hint:'Give practical examples such as semantics, keyboard support, labels, and contrast.' },
    { q:'Tell me about a bug involving an API and how you investigated it.', hint:'Describe reproduction, network inspection, hypothesis, fix, and validation.' }
  ],
  qa: [
    { q:'How would you write a useful bug report?', hint:'Cover environment, steps, expected result, actual result, evidence, and severity.' },
    { q:'How do you decide what to test first when time is limited?', hint:'Talk about risk, critical flows, impact, and recent changes.' },
    { q:'What is regression testing and when would you run it?', hint:'Explain the purpose and give an example.' },
    { q:'What would you automate first in a product?', hint:'Choose stable, repetitive, high-value tests and explain why.' },
    { q:'Tell me about a disagreement with a developer about a bug.', hint:'Focus on evidence, communication, user impact, and resolution.' }
  ],
  support: [
    { q:'A user says “the system is not working.” What do you do first?', hint:'Show how you clarify the problem before changing anything.' },
    { q:'How do you prioritize several support tickets at the same time?', hint:'Use impact, urgency, blocked users, and service commitments.' },
    { q:'How would you handle an angry customer?', hint:'Show empathy, ownership, clear next steps, and boundaries.' },
    { q:'Tell me how you would troubleshoot a network connectivity issue.', hint:'Explain your diagnostic sequence instead of jumping to one cause.' },
    { q:'Why is documentation important in technical support?', hint:'Mention consistency, faster resolution, handoff, and knowledge sharing.' }
  ]
};

const sessionForm=document.querySelector('#session-form');
const setupSection=document.querySelector('#setup-section');
const trainingSection=document.querySelector('#training-section');
const answerForm=document.querySelector('#answer-form');
const feedbackEl=document.querySelector('#feedback');
const historyEl=document.querySelector('#session-history');
const accountDialog=document.querySelector('#account-dialog');
const accountOpen=document.querySelector('#account-open');
const accountForm=document.querySelector('#auth-form');
const accountProfile=document.querySelector('#account-profile');
const accountMessage=document.querySelector('#account-message');
const importLocalButton=document.querySelector('#import-local');
const syncStatus=document.querySelector('#sync-status');

let currentUser=null;
let cloudData={sessions:[],answers:[]};
let currentSessionId='';
let cloudLoading=false;

function escapeHtml(value=''){
  return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function makeUuid(){
  if(crypto.randomUUID) return crypto.randomUUID();
  const bytes=crypto.getRandomValues(new Uint8Array(16));
  bytes[6]=(bytes[6]&0x0f)|0x40;bytes[8]=(bytes[8]&0x3f)|0x80;
  return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/,'$1-$2-$3-$4-$5');
}
function readLocal(){
  try{
    const value=JSON.parse(localStorage.getItem(LOCAL_KEY)||'{}');
    return {sessions:Array.isArray(value.sessions)?value.sessions:[],answers:Array.isArray(value.answers)?value.answers:[]};
  }catch{return {sessions:[],answers:[]};}
}
function writeLocal(data){localStorage.setItem(LOCAL_KEY,JSON.stringify(data));}
function source(){return currentUser?cloudData:readLocal();}
function showToast(message){
  const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('on');setTimeout(()=>toast.classList.remove('on'),1800);
}
function mapSession(row){
  return {id:row.id,role:row.target_role,level:row.level,language:row.language,status:row.status,score:row.score==null?null:Number(row.score),startedAt:Date.parse(row.started_at),finishedAt:row.finished_at?Date.parse(row.finished_at):null};
}
function mapAnswer(row){
  return {id:row.id,sessionId:row.session_id,question:row.question,answer:row.answer,feedback:row.feedback,score:row.score==null?null:Number(row.score),createdAt:Date.parse(row.created_at)};
}
function categoryForRole(role){
  const value=String(role||'').toLowerCase();
  if(/front|react|web|javascript|ui/.test(value)) return 'frontend';
  if(/qa|quality|teste|test/.test(value)) return 'qa';
  if(/suporte|support|help.?desk|infra|service.?desk|ti/.test(value)) return 'support';
  return 'general';
}
function questionsFor(session){return QUESTION_BANK[categoryForRole(session.role)]||QUESTION_BANK.general;}
function answersFor(sessionId){return source().answers.filter(answer=>answer.sessionId===sessionId).sort((a,b)=>a.createdAt-b.createdAt);}
function activeSession(){
  const sessions=source().sessions.filter(session=>session.status==='in_progress').sort((a,b)=>b.startedAt-a.startedAt);
  let session=sessions.find(item=>item.id===currentSessionId);
  if(!session&&sessions.length){session=sessions[0];currentSessionId=session.id;}
  return session||null;
}
function levelLabel(level){return {beginner:'Iniciante',intermediate:'Intermediário',advanced:'Avançado'}[level]||level;}

function evaluateAnswer(answer,role){
  const text=String(answer||'').trim();
  const lower=text.toLowerCase();
  const words=text.split(/\s+/).filter(Boolean);
  let score=20;
  const tips=[];
  const positives=[];

  if(words.length>=30&&words.length<=120){score+=25;positives.push('Boa extensão para uma resposta de entrevista.');}
  else if(words.length>=18){score+=15;tips.push('Tente desenvolver um pouco mais o contexto ou o resultado.');}
  else{score+=5;tips.push('A resposta está curta. Acrescente contexto, sua ação e o resultado.');}

  const actionWords=['built','created','implemented','fixed','improved','designed','tested','organized','led','helped','solved','developed','reduced','increased','worked'];
  if(actionWords.some(word=>lower.includes(word))){score+=18;positives.push('Você usa verbos de ação que deixam sua contribuição mais clara.');}
  else tips.push('Use um verbo de ação claro, por exemplo: built, implemented, fixed, improved ou solved.');

  const resultSignals=['result','improved','reduced','increased','faster','saved','percent','%','successful','resolved','completed','delivered'];
  if(resultSignals.some(word=>lower.includes(word))||/\d/.test(text)){score+=18;positives.push('A resposta apresenta sinal de resultado ou evidência.');}
  else tips.push('Feche com o resultado: o que melhorou, foi entregue ou mudou depois da sua ação?');

  const connectors=['because','then','after','finally','therefore','so that','as a result','when'];
  if(connectors.some(word=>lower.includes(word))){score+=12;positives.push('A sequência de ideias está conectada.');}
  else tips.push('Conecte as etapas com palavras como because, then, after ou as a result.');

  if(/\b(i|my|we|our)\b/i.test(text)){score+=7;}
  if(/situation|task|action|result/.test(lower)){score+=5;}

  const roleCategory=categoryForRole(role);
  const roleTerms={
    frontend:['react','javascript','css','html','api','component','accessibility','performance','state'],
    qa:['test','bug','regression','automation','severity','expected','actual','risk'],
    support:['user','ticket','issue','network','troubleshoot','priority','documentation','customer'],
    general:['team','project','customer','problem','goal','experience','skill']
  }[roleCategory];
  if(roleTerms.some(term=>lower.includes(term))){score+=10;positives.push('A resposta usa vocabulário relacionado ao contexto da vaga.');}
  else tips.push('Inclua ao menos um detalhe específico do seu trabalho ou da vaga.');

  score=Math.max(20,Math.min(100,score));
  if(!tips.length) tips.push('Agora pratique em voz alta e tente manter a mesma estrutura sem ler.');
  return {score,positives:positives.slice(0,3),tips:tips.slice(0,3)};
}
function feedbackText(result){
  return [...result.positives.map(x=>'Ponto forte: '+x),...result.tips.map(x=>'Próximo passo: '+x)].join('\n');
}
function renderFeedback(result){
  feedbackEl.hidden=false;
  feedbackEl.innerHTML='<div class="feedback-head"><span>Pontuação por regras</span><strong>'+result.score+'/100</strong></div>'+
    (result.positives.length?'<div class="feedback-block good"><strong>O que funcionou</strong><ul>'+result.positives.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul></div>':'')+
    '<div class="feedback-block improve"><strong>Próxima melhoria</strong><ul>'+result.tips.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul></div>'+
    '<button id="next-question" class="button ghost full" type="button">Próxima pergunta</button>';
  document.querySelector('#next-question').addEventListener('click',()=>{feedbackEl.hidden=true;answerForm.hidden=false;answerForm.reset();updateWordCount();renderTraining();});
}
function sessionAverage(sessionId){
  const scores=answersFor(sessionId).map(a=>a.score).filter(Number.isFinite);
  return scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null;
}
function renderAnswered(session){
  const answers=answersFor(session.id);
  document.querySelector('#live-score').textContent=sessionAverage(session.id)==null?'—':sessionAverage(session.id);
  const list=document.querySelector('#answered-list');
  list.innerHTML=answers.length?answers.map((answer,index)=>'<div class="answered-item"><span>'+(index+1)+'</span><div><strong>'+escapeHtml(answer.question)+'</strong><small>'+answer.score+'/100</small></div></div>').join(''):'<div class="empty-mini">As respostas aparecem aqui.</div>';
}
function renderTraining(){
  const session=activeSession();
  if(!session){setupSection.hidden=false;trainingSection.hidden=true;renderHistory();renderGlobalScore();return;}
  setupSection.hidden=true;trainingSection.hidden=false;
  const questions=questionsFor(session);
  const answers=answersFor(session.id);
  const index=Math.min(answers.length,questions.length-1);

  document.querySelector('#session-role').textContent=session.role;
  document.querySelector('#session-level').textContent=levelLabel(session.level);
  document.querySelector('#progress-bar').style.width=((answers.length/questions.length)*100)+'%';
  document.querySelector('#question-count').textContent='Pergunta '+Math.min(answers.length+1,questions.length)+' de '+questions.length;
  renderAnswered(session);

  if(answers.length>=questions.length){
    finishSession(session).catch(console.error);
    return;
  }

  const question=questions[index];
  document.querySelector('#question-text').textContent=question.q;
  document.querySelector('#question-hint').textContent=question.hint;
  answerForm.hidden=false;
  feedbackEl.hidden=true;
  renderHistory();
  renderGlobalScore();
}
function renderGlobalScore(){
  const scores=source().answers.map(answer=>answer.score).filter(Number.isFinite);
  document.querySelector('#hero-score').textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):'—';
}
function renderHistory(){
  const data=source();
  const sessions=[...data.sessions].sort((a,b)=>b.startedAt-a.startedAt);
  historyEl.innerHTML=sessions.length?sessions.map(session=>{
    const answers=data.answers.filter(a=>a.sessionId===session.id);
    const avg=session.score??(answers.length?Math.round(answers.map(a=>a.score||0).reduce((x,y)=>x+y,0)/answers.length):null);
    return '<article class="history-card"><div><strong>'+escapeHtml(session.role)+'</strong><span>'+escapeHtml(levelLabel(session.level))+' · '+new Date(session.startedAt).toLocaleDateString('pt-BR')+'</span></div>'+
      '<div class="history-score"><strong>'+(avg==null?'—':avg)+'</strong><span>'+answers.length+' resposta(s)</span></div>'+
      '<span class="history-status '+(session.status==='completed'?'done':'active')+'">'+(session.status==='completed'?'Concluída':'Em andamento')+'</span></article>';
  }).join(''):'<div class="empty-box"><strong>Nenhuma sessão ainda.</strong><span>Comece um treino para criar seu histórico.</span></div>';
}
async function createSession(values){
  const session={id:makeUuid(),role:values.role.trim(),level:values.level,language:'en',status:'in_progress',score:null,startedAt:Date.now(),finishedAt:null};
  if(currentUser&&supabaseClient){
    const {data,error}=await supabaseClient.from('falapro_sessions').insert({id:session.id,user_id:currentUser.id,target_role:session.role,level:session.level,language:'en',status:'in_progress'}).select('*').single();
    if(error) throw error;
    cloudData.sessions.unshift(mapSession(data));
  }else{
    const data=readLocal();data.sessions.unshift(session);writeLocal(data);
  }
  currentSessionId=session.id;
}
async function saveAnswer(session,question,answerText,result){
  const answer={id:makeUuid(),sessionId:session.id,question:question.q,answer:answerText,feedback:feedbackText(result),score:result.score,createdAt:Date.now()};
  if(currentUser&&supabaseClient){
    const {data,error}=await supabaseClient.from('falapro_answers').insert({id:answer.id,user_id:currentUser.id,session_id:session.id,question:answer.question,answer:answer.answer,feedback:answer.feedback,score:answer.score}).select('*').single();
    if(error) throw error;
    cloudData.answers.push(mapAnswer(data));
  }else{
    const data=readLocal();data.answers.push(answer);writeLocal(data);
  }
}
async function finishSession(session){
  if(session.status==='completed') return;
  const avg=sessionAverage(session.id);
  const finishedAt=Date.now();
  if(currentUser&&supabaseClient){
    const {data,error}=await supabaseClient.from('falapro_sessions').update({status:'completed',score:avg,finished_at:new Date(finishedAt).toISOString()}).eq('id',session.id).select('*').single();
    if(error) throw error;
    const mapped=mapSession(data);cloudData.sessions=cloudData.sessions.map(item=>item.id===session.id?mapped:item);
  }else{
    const data=readLocal();data.sessions=data.sessions.map(item=>item.id===session.id?{...item,status:'completed',score:avg,finishedAt}:item);writeLocal(data);
  }
  currentSessionId='';
  setupSection.hidden=false;trainingSection.hidden=true;renderHistory();renderGlobalScore();showToast('Sessão concluída.');
}
async function loadCloudData(){
  if(!currentUser) return;
  cloudLoading=true;updateAccountUi();
  const owner=currentUser.id;
  const [sessionsResult,answersResult]=await Promise.all([
    supabaseClient.from('falapro_sessions').select('*').order('started_at',{ascending:false}).limit(100),
    supabaseClient.from('falapro_answers').select('*').order('created_at',{ascending:true}).limit(1000)
  ]);
  cloudLoading=false;if(currentUser?.id!==owner) return;
  if(sessionsResult.error||answersResult.error) accountMessage.textContent='Parte do histórico não pôde ser carregada.';
  cloudData={sessions:(sessionsResult.data||[]).map(mapSession),answers:(answersResult.data||[]).map(mapAnswer)};
  currentSessionId='';updateAccountUi();renderTraining();
}
function authErrorText(error){
  const message=String(error?.message||'').toLowerCase();
  if(message.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if(message.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if(message.includes('already registered')) return 'Este e-mail já possui conta.';
  if(message.includes('password should be at least')) return 'Use uma senha com pelo menos 8 caracteres.';
  return 'Não foi possível concluir. Confira os dados e tente novamente.';
}
function updateAccountUi(){
  accountOpen.disabled=!supabaseClient;accountOpen.textContent=currentUser?'Minha conta':'Entrar / sincronizar';
  syncStatus.textContent=currentUser?(cloudLoading?'Sincronizando…':'Nuvem · '+(currentUser.email||'conectado')):(supabaseClient?'Modo local':'Modo local · nuvem indisponível');
  accountForm.hidden=Boolean(currentUser)||!supabaseClient;accountProfile.hidden=!currentUser;
  if(currentUser){document.querySelector('#account-email').textContent=currentUser.email||'Conta conectada';importLocalButton.hidden=readLocal().sessions.length===0;}
}
async function importLocalData(){
  if(!currentUser) return;
  const local=readLocal();if(!local.sessions.length) return;
  importLocalButton.disabled=true;accountMessage.textContent='Importando sessões e respostas…';
  try{
    for(const session of local.sessions){
      const {error}=await supabaseClient.from('falapro_sessions').upsert({id:session.id,user_id:currentUser.id,target_role:session.role,level:session.level,language:'en',status:session.status,score:session.score,started_at:new Date(session.startedAt).toISOString(),finished_at:session.finishedAt?new Date(session.finishedAt).toISOString():null},{onConflict:'id'});
      if(error) throw error;
    }
    if(local.answers.length){
      const rows=local.answers.map(answer=>({id:answer.id,user_id:currentUser.id,session_id:answer.sessionId,question:answer.question,answer:answer.answer,feedback:answer.feedback||'',score:answer.score,created_at:new Date(answer.createdAt).toISOString()}));
      const {error}=await supabaseClient.from('falapro_answers').upsert(rows,{onConflict:'id'});if(error) throw error;
    }
    localStorage.removeItem(LOCAL_KEY);await loadCloudData();accountMessage.textContent='Importação concluída.';importLocalButton.hidden=true;
  }catch(error){console.error(error);accountMessage.textContent='Não foi possível importar tudo. Os dados locais foram preservados.';}
  finally{importLocalButton.disabled=false;}
}
function migrateLegacy(){
  const current=readLocal();if(current.sessions.length) return;
  try{
    const legacy=JSON.parse(localStorage.getItem('ideias-plus-03-entrevista-fluente')||'[]');if(!Array.isArray(legacy)||!legacy.length) return;
    for(const entry of legacy.slice(0,20)){
      const meta=String(entry.meta||'').split(' · ');const answerText=meta[0]||'';const level=meta[1]||'intermediate';
      const session={id:makeUuid(),role:'Entrevista geral',level:/avanç/i.test(level)?'advanced':/inic/i.test(level)?'beginner':'intermediate',language:'en',status:'completed',score:null,startedAt:Number(entry.time||Date.now()),finishedAt:Number(entry.time||Date.now())};
      const result=evaluateAnswer(answerText,session.role);
      current.sessions.push({...session,score:result.score});
      current.answers.push({id:makeUuid(),sessionId:session.id,question:entry.title||'Interview question',answer:answerText,feedback:feedbackText(result),score:result.score,createdAt:Number(entry.time||Date.now())});
    }
    writeLocal(current);
  }catch{}
}
function updateWordCount(){
  const words=answerForm.elements.answer.value.trim().split(/\s+/).filter(Boolean).length;
  document.querySelector('#word-count').textContent=words+' palavra'+(words===1?'':'s');
}
sessionForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!sessionForm.reportValidity()) return;
  const submit=sessionForm.querySelector('[type="submit"]');submit.disabled=true;
  try{await createSession(Object.fromEntries(new FormData(sessionForm)));sessionForm.reset();sessionForm.elements.level.value='intermediate';renderTraining();showToast('Sessão iniciada.');}
  catch(error){console.error(error);showToast('Não foi possível iniciar a sessão.');}
  finally{submit.disabled=false;}
});
answerForm.elements.answer.addEventListener('input',updateWordCount);
answerForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!answerForm.reportValidity()) return;
  const session=activeSession();if(!session) return;
  const questions=questionsFor(session);const answers=answersFor(session.id);const question=questions[answers.length];if(!question) return;
  const answerText=answerForm.elements.answer.value.trim();const result=evaluateAnswer(answerText,session.role);
  const submit=answerForm.querySelector('[type="submit"]');submit.disabled=true;
  try{await saveAnswer(session,question,answerText,result);answerForm.hidden=true;renderFeedback(result);renderAnswered(session);renderGlobalScore();renderHistory();}
  catch(error){console.error(error);showToast('Não foi possível salvar a resposta.');}
  finally{submit.disabled=false;}
});
document.querySelector('#end-session').addEventListener('click',async()=>{
  const session=activeSession();if(!session||!window.confirm('Encerrar esta sessão agora? As respostas já feitas serão mantidas.')) return;
  try{await finishSession(session);}catch(error){console.error(error);showToast('Não foi possível encerrar a sessão.');}
});
accountOpen.addEventListener('click',()=>accountDialog.showModal());
document.querySelector('#account-close').addEventListener('click',()=>accountDialog.close());
accountDialog.addEventListener('click',event=>{if(event.target===accountDialog) accountDialog.close();});
accountForm.addEventListener('submit',async event=>{
  event.preventDefault();if(!supabaseClient) return;const submit=accountForm.querySelector('[type="submit"]');submit.disabled=true;accountMessage.textContent='Entrando…';
  try{const {error}=await supabaseClient.auth.signInWithPassword({email:accountForm.elements.email.value.trim(),password:accountForm.elements.password.value});if(error) throw error;accountMessage.textContent='Conta conectada.';}
  catch(error){accountMessage.textContent=authErrorText(error);}finally{submit.disabled=false;}
});
document.querySelector('#sign-up').addEventListener('click',async()=>{
  if(!supabaseClient) return;const email=accountForm.elements.email.value.trim();const password=accountForm.elements.password.value;
  if(!email||password.length<8){accountMessage.textContent='Informe um e-mail e uma senha com pelo menos 8 caracteres.';return;}
  const button=document.querySelector('#sign-up');button.disabled=true;accountMessage.textContent='Criando conta…';
  try{const {data,error}=await supabaseClient.auth.signUp({email,password});if(error) throw error;accountMessage.textContent=data.session?'Conta criada e conectada.':'Conta criada. Confirme seu e-mail e depois entre.';}
  catch(error){accountMessage.textContent=authErrorText(error);}finally{button.disabled=false;}
});
document.querySelector('#reset-password').addEventListener('click',async()=>{
  if(!supabaseClient) return;const email=accountForm.elements.email.value.trim();if(!email){accountMessage.textContent='Informe seu e-mail primeiro.';return;}
  try{const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.href.split('#')[0]});if(error) throw error;accountMessage.textContent='Se o e-mail estiver cadastrado, enviaremos um link de recuperação.';}
  catch(error){accountMessage.textContent=authErrorText(error);}
});
document.querySelector('#sign-out').addEventListener('click',async()=>{if(!supabaseClient)return;const {error}=await supabaseClient.auth.signOut();accountMessage.textContent=error?'Não foi possível sair.':'Você saiu da conta.';});
importLocalButton.addEventListener('click',importLocalData);
async function initAuth(){
  if(!supabaseClient){updateAccountUi();renderTraining();return;}
  let activeUserId=null;
  const setSession=session=>{const user=session?.user||null;if(user?.id===activeUserId)return;activeUserId=user?.id||null;currentUser=user;cloudData={sessions:[],answers:[]};currentSessionId='';updateAccountUi();if(user)setTimeout(loadCloudData,0);else renderTraining();};
  supabaseClient.auth.onAuthStateChange((_event,session)=>setTimeout(()=>setSession(session),0));
  const {data,error}=await supabaseClient.auth.getSession();if(error){accountMessage.textContent='Não foi possível verificar sua sessão. O modo local continua disponível.';renderTraining();return;}setSession(data.session);
}
function init(){migrateLegacy();updateWordCount();updateAccountUi();renderTraining();initAuth();}
init();
