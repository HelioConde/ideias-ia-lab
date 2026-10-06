const supabaseClient = window.IDEIAS_SUPABASE?.client || null;
const LOCAL_KEY = 'revisa-data-v2';
const ACTIVE_GOAL_KEY = 'revisa-active-goal-v2';

const emptyState = document.querySelector('#empty-state');
const dashboard = document.querySelector('#dashboard');
const goalSelect = document.querySelector('#goal-select');
const todaySessions = document.querySelector('#today-sessions');
const weekPlan = document.querySelector('#week-plan');
const questionSubject = document.querySelector('#question-subject');
const questionArea = document.querySelector('#question-area');
const goalDialog = document.querySelector('#goal-dialog');
const goalForm = document.querySelector('#goal-form');
const goalMessage = document.querySelector('#goal-message');
const accountDialog = document.querySelector('#account-dialog');
const accountOpen = document.querySelector('#account-open');
const accountForm = document.querySelector('#auth-form');
const accountProfile = document.querySelector('#account-profile');
const accountMessage = document.querySelector('#account-message');
const importLocalButton = document.querySelector('#import-local');
const syncStatus = document.querySelector('#sync-status');

let questions = [];
let currentUser = null;
let cloudData = { goals: [], sessions: [], attempts: [] };
let activeGoalId = localStorage.getItem(ACTIVE_GOAL_KEY) || '';
let currentQuestionId = '';
let questionStartedAt = Date.now();
let cloudLoading = false;

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function makeUuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
    .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

function todayString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function addDays(dateString, days) {
  const date = new Date(dateString + 'T12:00:00');
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(from, to) {
  const a = new Date(from + 'T12:00:00');
  const b = new Date(to + 'T12:00:00');
  return Math.ceil((b - a) / 86400000);
}

function formatDate(dateString, options = {}) {
  return new Date(dateString + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    ...options
  });
}

function normalizeText(value) {
  return String(value || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{M}/gu, '').trim();
}

function uniqueSubjects(raw) {
  const seen = new Set();
  return String(raw || '')
    .split(/[,;\n]+/)
    .map(item => item.trim())
    .filter(Boolean)
    .filter(item => {
      const key = normalizeText(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

function readLocalData() {
  try {
    const value = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
    return {
      goals: Array.isArray(value.goals) ? value.goals : [],
      sessions: Array.isArray(value.sessions) ? value.sessions : [],
      attempts: Array.isArray(value.attempts) ? value.attempts : []
    };
  } catch {
    return { goals: [], sessions: [], attempts: [] };
  }
}

function writeLocalData(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
}

function dataSource() {
  return currentUser ? cloudData : readLocalData();
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('on');
  window.setTimeout(() => toast.classList.remove('on'), 1800);
}

function mapGoal(row) {
  return {
    id: row.id,
    examName: row.exam_name,
    examDate: row.exam_date || '',
    targetScore: row.target_score == null ? null : Number(row.target_score),
    minutes: Number(row.study_minutes_per_day || 60),
    subjects: Array.isArray(row.subjects) ? row.subjects : [],
    status: row.status || 'active',
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at)
  };
}

function mapSession(row) {
  return {
    id: row.id,
    goalId: row.goal_id,
    date: row.scheduled_date,
    subject: row.subject,
    plannedMinutes: Number(row.planned_minutes),
    completedMinutes: Number(row.completed_minutes || 0),
    status: row.status || 'planned',
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at)
  };
}

function mapAttempt(row) {
  return {
    id: row.id,
    goalId: row.goal_id,
    questionId: row.question_id,
    selectedAnswer: row.selected_answer,
    correct: row.correct,
    timeSeconds: Number(row.time_seconds || 0),
    createdAt: Date.parse(row.created_at)
  };
}

function activeGoals() {
  return dataSource().goals.filter(goal => goal.status === 'active')
    .sort((a,b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
}

function activeGoal() {
  const goals = activeGoals();
  if (!goals.length) return null;
  let goal = goals.find(item => item.id === activeGoalId);
  if (!goal) {
    goal = goals[0];
    activeGoalId = goal.id;
    localStorage.setItem(ACTIVE_GOAL_KEY, goal.id);
  }
  return goal;
}

function sessionsForGoal(goalId) {
  return dataSource().sessions.filter(session => session.goalId === goalId);
}

function attemptsForGoal(goalId) {
  return dataSource().attempts.filter(attempt => attempt.goalId === goalId);
}

function generateSessions(goal) {
  const start = todayString();
  const examDate = goal.examDate && goal.examDate >= start ? goal.examDate : start;
  const daysToExam = Math.max(0, daysBetween(start, examDate));
  const horizon = Math.min(daysToExam, 89);
  const subjects = goal.subjects.length ? goal.subjects : ['Revisão geral'];
  const dailyMinutes = Math.max(15, Math.min(240, Number(goal.minutes || 60)));
  const blocks = Math.max(1, Math.ceil(dailyMinutes / 45));
  const base = Math.floor(dailyMinutes / blocks);
  const remainder = dailyMinutes - base * blocks;
  const sessions = [];

  for (let day = 0; day <= horizon; day++) {
    const date = addDays(start, day);
    for (let block = 0; block < blocks; block++) {
      const plannedMinutes = base + (block < remainder ? 1 : 0);
      const subject = subjects[(day * blocks + block) % subjects.length];
      sessions.push({
        id: makeUuid(),
        goalId: goal.id,
        date,
        subject,
        plannedMinutes,
        completedMinutes: 0,
        status: 'planned',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
  }
  return sessions;
}

function renderGoalSelector() {
  const goals = activeGoals();
  goalSelect.innerHTML = goals.map(goal =>
    '<option value="' + escapeHtml(goal.id) + '"' + (goal.id === activeGoalId ? ' selected' : '') + '>' +
      escapeHtml(goal.examName) + (goal.examDate ? ' · ' + escapeHtml(formatDate(goal.examDate)) : '') +
    '</option>'
  ).join('');
}

function renderMetrics(goal) {
  const today = todayString();
  const days = goal.examDate ? Math.max(0, daysBetween(today, goal.examDate)) : null;
  const sessions = sessionsForGoal(goal.id);
  const completed = sessions.filter(session => session.status === 'completed');
  const attempts = attemptsForGoal(goal.id);
  const correct = attempts.filter(attempt => attempt.correct === true).length;
  const accuracy = attempts.length ? Math.round(correct / attempts.length * 100) : null;

  document.querySelector('#metric-days').textContent = days == null ? '—' : String(days);
  document.querySelector('#metric-date').textContent = goal.examDate ? 'prova em ' + formatDate(goal.examDate, { year:'numeric' }) : 'sem data';
  document.querySelector('#metric-minutes').textContent = String(goal.minutes || 0);
  document.querySelector('#metric-progress').textContent = sessions.length ? Math.round(completed.length / sessions.length * 100) + '%' : '0%';
  document.querySelector('#metric-progress-detail').textContent = completed.length + ' de ' + sessions.length + ' blocos';
  document.querySelector('#metric-accuracy').textContent = accuracy == null ? '—' : accuracy + '%';
  document.querySelector('#metric-attempts').textContent = attempts.length
    ? attempts.length + ' questão(ões) · meta ' + (goal.targetScore || 80) + '%'
    : 'responda a primeira questão';
}

function sessionHtml(session) {
  const complete = session.status === 'completed';
  return '<article class="session-item ' + (complete ? 'completed' : '') + '">' +
    '<div class="session-check">' + (complete ? '✓' : '○') + '</div>' +
    '<div class="session-info"><strong>' + escapeHtml(session.subject) + '</strong><span>' +
      session.plannedMinutes + ' min planejados' + (complete ? ' · concluído' : '') + '</span></div>' +
    '<button class="button ' + (complete ? 'text' : 'ghost') + '" type="button" data-session="' + escapeHtml(session.id) + '">' +
      (complete ? 'Desfazer' : 'Concluir') + '</button>' +
  '</article>';
}

function renderToday(goal) {
  const sessions = sessionsForGoal(goal.id)
    .filter(session => session.date === todayString())
    .sort((a,b) => a.subject.localeCompare(b.subject, 'pt-BR'));

  document.querySelector('#today-total').textContent =
    sessions.reduce((sum, item) => sum + item.plannedMinutes, 0) + ' min';

  todaySessions.innerHTML = sessions.length
    ? sessions.map(sessionHtml).join('')
    : '<div class="empty-box"><strong>Nenhum bloco para hoje.</strong><span>Crie ou atualize uma meta para montar o plano.</span></div>';
}

function renderWeek(goal) {
  const start = todayString();
  const end = addDays(start, 6);
  const sessions = sessionsForGoal(goal.id)
    .filter(session => session.date >= start && session.date <= end)
    .sort((a,b) => (a.date + a.subject).localeCompare(b.date + b.subject));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    const items = sessions.filter(session => session.date === date);
    days.push({ date, items });
  }

  weekPlan.innerHTML = days.map(day => {
    const completed = day.items.filter(item => item.status === 'completed').length;
    return '<article class="day-card">' +
      '<div class="day-head"><strong>' + escapeHtml(formatDate(day.date, { weekday:'short' })) + '</strong>' +
      '<span>' + completed + '/' + day.items.length + '</span></div>' +
      '<div class="day-items">' +
        (day.items.length
          ? day.items.map(item => '<div class="' + (item.status === 'completed' ? 'done' : '') + '"><span>' +
              escapeHtml(item.subject) + '</span><small>' + item.plannedMinutes + ' min</small></div>').join('')
          : '<small>Sem bloco</small>') +
      '</div></article>';
  }).join('');
}

function subjectMatches(goalSubject, questionSubjectValue) {
  const a = normalizeText(goalSubject);
  const b = normalizeText(questionSubjectValue);
  return a === b || a.includes(b) || b.includes(a);
}

function questionPool(goal) {
  let pool = questions;
  const filter = questionSubject.value;
  if (filter) {
    pool = pool.filter(question => normalizeText(question.subject) === normalizeText(filter));
  } else if (goal?.subjects?.length) {
    const matched = pool.filter(question => goal.subjects.some(subject => subjectMatches(subject, question.subject)));
    if (matched.length) pool = matched;
  }
  return pool;
}

function chooseQuestion(goal, forceNext = false) {
  const pool = questionPool(goal);
  if (!pool.length) {
    currentQuestionId = '';
    return null;
  }

  const attemptedIds = new Set(attemptsForGoal(goal.id).map(attempt => attempt.questionId));
  if (!forceNext && currentQuestionId) {
    const current = pool.find(question => question.id === currentQuestionId);
    if (current) return current;
  }

  const next = pool.find(question => !attemptedIds.has(question.id)) || pool[attemptsForGoal(goal.id).length % pool.length];
  currentQuestionId = next.id;
  questionStartedAt = Date.now();
  return next;
}

function renderQuestionSubjects(goal) {
  const catalogSubjects = [...new Set(questions.map(question => question.subject))].sort((a,b) => a.localeCompare(b,'pt-BR'));
  const goalSubjects = catalogSubjects.filter(subject => goal.subjects.some(item => subjectMatches(item, subject)));
  const subjects = goalSubjects.length ? goalSubjects : catalogSubjects;
  const current = questionSubject.value;
  questionSubject.innerHTML = '<option value="">Matérias da meta</option>' +
    subjects.map(subject => '<option value="' + escapeHtml(subject) + '">' + escapeHtml(subject) + '</option>').join('');
  if (subjects.includes(current)) questionSubject.value = current;
}

function renderQuestion(goal, forceNext = false) {
  renderQuestionSubjects(goal);
  const question = chooseQuestion(goal, forceNext);
  if (!question) {
    questionArea.innerHTML = '<div class="empty-box"><strong>Nenhuma questão encontrada.</strong><span>O banco inicial pode ainda não cobrir as matérias desta meta.</span></div>';
    return;
  }

  const alternatives = Array.isArray(question.alternatives) ? question.alternatives : [];
  questionArea.innerHTML =
    '<div class="question-meta"><span>' + escapeHtml(question.subject) + '</span><span>Dificuldade ' + Number(question.difficulty || 1) + '</span></div>' +
    '<h3>' + escapeHtml(question.statement) + '</h3>' +
    '<form id="question-form">' +
      '<div class="alternatives">' +
        alternatives.map(alt =>
          '<label><input type="radio" name="answer" value="' + escapeHtml(alt.key) + '" required>' +
          '<span><b>' + escapeHtml(alt.key) + '</b> ' + escapeHtml(alt.text) + '</span></label>'
        ).join('') +
      '</div>' +
      '<button class="button primary full" type="submit">Responder</button>' +
    '</form>';

  document.querySelector('#question-form').addEventListener('submit', async event => {
    event.preventDefault();
    const answer = new FormData(event.currentTarget).get('answer');
    if (!answer) return;
    const correct = String(answer) === String(question.correct_answer);
    const elapsed = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
    const submit = event.currentTarget.querySelector('[type="submit"]');
    submit.disabled = true;

    try {
      await saveAttempt(goal, question, String(answer), correct, elapsed);
      questionArea.innerHTML +=
        '<div class="answer-feedback ' + (correct ? 'correct' : 'wrong') + '">' +
          '<strong>' + (correct ? 'Resposta correta ✓' : 'Resposta incorreta') + '</strong>' +
          '<p>' + escapeHtml(question.explanation || 'Revise este tópico antes da próxima tentativa.') + '</p>' +
          '<button id="next-question" class="button ghost" type="button">Próxima questão</button>' +
        '</div>';
      document.querySelector('#next-question').addEventListener('click', () => renderQuestion(goal, true));
      renderMetrics(goal);
    } catch (error) {
      console.error(error);
      showToast('Não foi possível registrar a resposta.');
      submit.disabled = false;
    }
  });
}

function renderDashboard() {
  const goal = activeGoal();
  const hasGoal = Boolean(goal);
  emptyState.hidden = hasGoal;
  dashboard.hidden = !hasGoal;

  if (!goal) {
    syncStatus.textContent = currentUser ? 'Nuvem · sem meta ativa' : 'Modo local · sem meta ativa';
    return;
  }

  renderGoalSelector();
  renderMetrics(goal);
  renderToday(goal);
  renderWeek(goal);
  renderQuestion(goal);
}

async function saveAttempt(goal, question, selectedAnswer, correct, timeSeconds) {
  const attempt = {
    id: makeUuid(),
    goalId: goal.id,
    questionId: question.id,
    selectedAnswer,
    correct,
    timeSeconds,
    createdAt: Date.now()
  };

  if (currentUser && supabaseClient) {
    const { data, error } = await supabaseClient.from('revisa_attempts').insert({
      id: attempt.id,
      user_id: currentUser.id,
      goal_id: goal.id,
      question_id: question.id,
      selected_answer: selectedAnswer,
      correct,
      time_seconds: timeSeconds
    }).select('*').single();
    if (error) throw error;
    cloudData.attempts.push(mapAttempt(data));
  } else {
    const data = readLocalData();
    data.attempts.push(attempt);
    writeLocalData(data);
  }
}

async function toggleSession(sessionId) {
  const source = dataSource();
  const session = source.sessions.find(item => item.id === sessionId);
  if (!session) return;
  const nextCompleted = session.status !== 'completed';
  const patch = {
    status: nextCompleted ? 'completed' : 'planned',
    completedMinutes: nextCompleted ? session.plannedMinutes : 0,
    updatedAt: Date.now()
  };

  if (currentUser && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('revisa_study_sessions')
      .update({
        status: patch.status,
        completed_minutes: patch.completedMinutes,
        updated_at: new Date(patch.updatedAt).toISOString()
      })
      .eq('id', sessionId)
      .select('*')
      .single();
    if (error) throw error;
    const mapped = mapSession(data);
    cloudData.sessions = cloudData.sessions.map(item => item.id === sessionId ? mapped : item);
  } else {
    const data = readLocalData();
    data.sessions = data.sessions.map(item => item.id === sessionId ? { ...item, ...patch } : item);
    writeLocalData(data);
  }
}

async function createGoal(values) {
  const subjects = uniqueSubjects(values.subjects);
  const goal = {
    id: makeUuid(),
    examName: values.examName.trim(),
    examDate: values.examDate,
    targetScore: Number(values.targetScore || 80),
    minutes: Number(values.minutes),
    subjects,
    status: 'active',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  const sessions = generateSessions(goal);

  if (currentUser && supabaseClient) {
    const { data: row, error } = await supabaseClient.from('revisa_goals').insert({
      id: goal.id,
      user_id: currentUser.id,
      exam_name: goal.examName,
      exam_date: goal.examDate,
      target_score: goal.targetScore,
      study_minutes_per_day: goal.minutes,
      subjects: goal.subjects,
      status: 'active'
    }).select('*').single();
    if (error) throw error;

    const sessionRows = sessions.map(session => ({
      id: session.id,
      user_id: currentUser.id,
      goal_id: goal.id,
      scheduled_date: session.date,
      subject: session.subject,
      planned_minutes: session.plannedMinutes,
      completed_minutes: 0,
      status: 'planned'
    }));

    const { data: savedSessions, error: sessionError } = await supabaseClient
      .from('revisa_study_sessions')
      .insert(sessionRows)
      .select('*');
    if (sessionError) {
      await supabaseClient.from('revisa_goals').delete().eq('id', goal.id);
      throw sessionError;
    }

    cloudData.goals.unshift(mapGoal(row));
    cloudData.sessions.push(...(savedSessions || []).map(mapSession));
  } else {
    const data = readLocalData();
    data.goals.unshift(goal);
    data.sessions.push(...sessions);
    writeLocalData(data);
  }

  activeGoalId = goal.id;
  localStorage.setItem(ACTIVE_GOAL_KEY, goal.id);
  currentQuestionId = '';
}

async function archiveActiveGoal() {
  const goal = activeGoal();
  if (!goal) return;

  if (currentUser && supabaseClient) {
    const { data, error } = await supabaseClient
      .from('revisa_goals')
      .update({ status:'archived', updated_at:new Date().toISOString() })
      .eq('id', goal.id)
      .select('*')
      .single();
    if (error) throw error;
    const mapped = mapGoal(data);
    cloudData.goals = cloudData.goals.map(item => item.id === goal.id ? mapped : item);
  } else {
    const data = readLocalData();
    data.goals = data.goals.map(item => item.id === goal.id ? { ...item, status:'archived', updatedAt:Date.now() } : item);
    writeLocalData(data);
  }

  activeGoalId = '';
  currentQuestionId = '';
  renderDashboard();
}

async function loadQuestions() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from('revisa_questions')
    .select('*')
    .eq('active', true)
    .order('subject')
    .order('difficulty');
  if (error) throw error;
  questions = data || [];
}

async function loadCloudData() {
  if (!currentUser) return;
  cloudLoading = true;
  updateAccountUi();
  const owner = currentUser.id;

  const [goalsResult, sessionsResult, attemptsResult] = await Promise.all([
    supabaseClient.from('revisa_goals').select('*').order('updated_at',{ascending:false}),
    supabaseClient.from('revisa_study_sessions').select('*').order('scheduled_date',{ascending:true}),
    supabaseClient.from('revisa_attempts').select('*').order('created_at',{ascending:false}).limit(500)
  ]);

  cloudLoading = false;
  if (currentUser?.id !== owner) return;

  if (goalsResult.error || sessionsResult.error || attemptsResult.error) {
    accountMessage.textContent = 'Parte dos seus dados de estudo não pôde ser carregada.';
  }

  cloudData = {
    goals: (goalsResult.data || []).map(mapGoal),
    sessions: (sessionsResult.data || []).map(mapSession),
    attempts: (attemptsResult.data || []).map(mapAttempt)
  };
  updateAccountUi();
  renderDashboard();
}

async function migrateLegacyLocal() {
  const current = readLocalData();
  if (current.goals.length) return;
  try {
    const legacy = JSON.parse(localStorage.getItem('ideias-plus-09-revisa-ai') || '[]');
    if (!Array.isArray(legacy) || !legacy.length) return;
    for (const entry of legacy.slice(0, 8)) {
      const meta = String(entry.meta || '').split(' · ');
      const subjects = uniqueSubjects(entry.title || '');
      const examDate = /^\d{4}-\d{2}-\d{2}$/.test(meta[0] || '') ? meta[0] : addDays(todayString(), 30);
      const minutes = Math.max(15, Math.min(240, Number(meta[1]) || 60));
      const goal = {
        id: makeUuid(),
        examName: 'Plano migrado',
        examDate,
        targetScore: 80,
        minutes,
        subjects,
        status:'active',
        createdAt:Number(entry.time || Date.now()),
        updatedAt:Number(entry.time || Date.now())
      };
      current.goals.push(goal);
      current.sessions.push(...generateSessions(goal));
    }
    if (current.goals.length) {
      writeLocalData(current);
      activeGoalId = current.goals[0].id;
      localStorage.setItem(ACTIVE_GOAL_KEY, activeGoalId);
    }
  } catch {
    // Mantém o histórico antigo intacto se a migração falhar.
  }
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
    importLocalButton.hidden = readLocalData().goals.length === 0;
  }
}

async function importLocalData() {
  if (!currentUser) return;
  const local = readLocalData();
  if (!local.goals.length) return;

  importLocalButton.disabled = true;
  accountMessage.textContent = 'Importando metas, sessões e tentativas…';

  try {
    for (const goal of local.goals) {
      const { error } = await supabaseClient.from('revisa_goals').upsert({
        id: goal.id,
        user_id: currentUser.id,
        exam_name: goal.examName,
        exam_date: goal.examDate || null,
        target_score: goal.targetScore,
        study_minutes_per_day: goal.minutes,
        subjects: goal.subjects,
        status: goal.status || 'active',
        created_at: new Date(goal.createdAt || Date.now()).toISOString(),
        updated_at: new Date(goal.updatedAt || Date.now()).toISOString()
      }, { onConflict:'id' });
      if (error) throw error;
    }

    if (local.sessions.length) {
      const rows = local.sessions.map(session => ({
        id: session.id,
        user_id: currentUser.id,
        goal_id: session.goalId,
        scheduled_date: session.date,
        subject: session.subject,
        planned_minutes: session.plannedMinutes,
        completed_minutes: session.completedMinutes || 0,
        status: session.status || 'planned',
        created_at: new Date(session.createdAt || Date.now()).toISOString(),
        updated_at: new Date(session.updatedAt || Date.now()).toISOString()
      }));
      const { error } = await supabaseClient.from('revisa_study_sessions').upsert(rows, { onConflict:'id' });
      if (error) throw error;
    }

    if (local.attempts.length) {
      const rows = local.attempts.map(attempt => ({
        id: attempt.id,
        user_id: currentUser.id,
        goal_id: attempt.goalId,
        question_id: attempt.questionId,
        selected_answer: attempt.selectedAnswer,
        correct: attempt.correct,
        time_seconds: attempt.timeSeconds || 0,
        created_at: new Date(attempt.createdAt || Date.now()).toISOString()
      }));
      const { error } = await supabaseClient.from('revisa_attempts').upsert(rows, { onConflict:'id' });
      if (error) throw error;
    }

    localStorage.removeItem(LOCAL_KEY);
    await loadCloudData();
    accountMessage.textContent = 'Importação concluída.';
    importLocalButton.hidden = true;
  } catch (error) {
    console.error(error);
    accountMessage.textContent = 'Não foi possível importar tudo. Os dados locais foram preservados.';
  } finally {
    importLocalButton.disabled = false;
  }
}

document.querySelector('#new-goal').addEventListener('click', () => goalDialog.showModal());
document.querySelectorAll('[data-new-goal]').forEach(button => button.addEventListener('click', () => goalDialog.showModal()));
document.querySelector('#goal-close').addEventListener('click', () => goalDialog.close());
goalDialog.addEventListener('click', event => {
  if (event.target === goalDialog) goalDialog.close();
});

goalForm.elements.examDate.min = todayString();
goalForm.elements.examDate.value = addDays(todayString(), 30);

goalForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!goalForm.reportValidity()) return;
  const values = Object.fromEntries(new FormData(goalForm));
  if (values.examDate < todayString()) {
    goalMessage.textContent = 'A data da prova precisa ser hoje ou uma data futura.';
    return;
  }
  if (!uniqueSubjects(values.subjects).length) {
    goalMessage.textContent = 'Informe pelo menos uma matéria.';
    return;
  }

  const submit = goalForm.querySelector('[type="submit"]');
  submit.disabled = true;
  goalMessage.textContent = currentUser ? 'Criando e sincronizando o plano…' : 'Criando plano…';
  try {
    await createGoal(values);
    goalDialog.close();
    goalForm.reset();
    goalForm.elements.minutes.value = '60';
    goalForm.elements.targetScore.value = '80';
    goalForm.elements.examDate.min = todayString();
    goalForm.elements.examDate.value = addDays(todayString(), 30);
    renderDashboard();
    showToast('Plano de estudos criado.');
  } catch (error) {
    console.error(error);
    goalMessage.textContent = 'Não foi possível criar o plano.';
  } finally {
    submit.disabled = false;
  }
});

goalSelect.addEventListener('change', () => {
  activeGoalId = goalSelect.value;
  localStorage.setItem(ACTIVE_GOAL_KEY, activeGoalId);
  currentQuestionId = '';
  renderDashboard();
});

document.querySelector('#archive-goal').addEventListener('click', async () => {
  if (!activeGoal() || !window.confirm('Arquivar esta meta? O histórico será mantido.')) return;
  try {
    await archiveActiveGoal();
    showToast('Meta arquivada.');
  } catch (error) {
    console.error(error);
    showToast('Não foi possível arquivar.');
  }
});

todaySessions.addEventListener('click', async event => {
  const button = event.target.closest('[data-session]');
  if (!button) return;
  button.disabled = true;
  try {
    await toggleSession(button.dataset.session);
    renderDashboard();
  } catch (error) {
    console.error(error);
    showToast('Não foi possível atualizar a sessão.');
  } finally {
    button.disabled = false;
  }
});

questionSubject.addEventListener('change', () => {
  currentQuestionId = '';
  const goal = activeGoal();
  if (goal) renderQuestion(goal, true);
});

accountOpen.addEventListener('click', () => accountDialog.showModal());
document.querySelector('#account-close').addEventListener('click', () => accountDialog.close());
accountDialog.addEventListener('click', event => {
  if (event.target === accountDialog) accountDialog.close();
});

accountForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabaseClient) return;
  const submit = accountForm.querySelector('[type="submit"]');
  submit.disabled = true;
  accountMessage.textContent = 'Entrando…';
  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: accountForm.elements.email.value.trim(),
      password: accountForm.elements.password.value
    });
    if (error) throw error;
    accountMessage.textContent = 'Conta conectada.';
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  } finally {
    submit.disabled = false;
  }
});

document.querySelector('#sign-up').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const email = accountForm.elements.email.value.trim();
  const password = accountForm.elements.password.value;
  if (!email || password.length < 8) {
    accountMessage.textContent = 'Informe um e-mail e uma senha com pelo menos 8 caracteres.';
    return;
  }
  const button = document.querySelector('#sign-up');
  button.disabled = true;
  accountMessage.textContent = 'Criando conta…';
  try {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;
    accountMessage.textContent = data.session
      ? 'Conta criada e conectada.'
      : 'Conta criada. Confirme seu e-mail e depois entre.';
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  } finally {
    button.disabled = false;
  }
});

document.querySelector('#reset-password').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const email = accountForm.elements.email.value.trim();
  if (!email) {
    accountMessage.textContent = 'Informe seu e-mail primeiro.';
    return;
  }
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.href.split('#')[0]
    });
    if (error) throw error;
    accountMessage.textContent = 'Se o e-mail estiver cadastrado, enviaremos um link de recuperação.';
  } catch (error) {
    accountMessage.textContent = authErrorText(error);
  }
});

document.querySelector('#sign-out').addEventListener('click', async () => {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  accountMessage.textContent = error ? 'Não foi possível sair.' : 'Você saiu da conta.';
});

importLocalButton.addEventListener('click', importLocalData);

async function initAuth() {
  if (!supabaseClient) {
    updateAccountUi();
    renderDashboard();
    return;
  }

  let activeUserId = null;
  const setSession = session => {
    const user = session?.user || null;
    if (user?.id === activeUserId) return;
    activeUserId = user?.id || null;
    currentUser = user;
    cloudData = { goals: [], sessions: [], attempts: [] };
    updateAccountUi();
    if (user) window.setTimeout(loadCloudData, 0);
    else renderDashboard();
  };

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    window.setTimeout(() => setSession(session), 0);
  });

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    accountMessage.textContent = 'Não foi possível verificar sua sessão. O modo local continua disponível.';
    renderDashboard();
    return;
  }
  setSession(data.session);
}

async function init() {
  updateAccountUi();
  try {
    await loadQuestions();
  } catch (error) {
    console.error(error);
    showToast('Não foi possível carregar o banco de questões.');
  }
  await migrateLegacyLocal();
  renderDashboard();
  await initAuth();
}

init();
