const app = document.querySelector('#app');
const sites = window.SITES || [];
const home = document.body.dataset.home === 'true';
const supabaseClient = window.IDEIAS_SUPABASE?.client || null;

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function moneyFromCents(cents) {
  return (Number(cents || 0) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function toCents(value) {
  const number = Number(String(value || '').replace(',', '.'));
  return Number.isFinite(number) ? Math.max(0, Math.round(number * 100)) : 0;
}

function base() {
  return '<div class="wrap"><header class="nav"><a class="brand" href="./">ideias<span>+</span></a><div class="navright">10 conceitos independentes · protótipos exploráveis</div></header>';
}

function footer() {
  return '<footer class="footer">Protótipos em validação. Os sete produtos restantes já usam o backend compartilhado quando o usuário entra; recursos externos, pagamentos e automações ainda dependem de integrações específicas.</footer></div>';
}

function renderHome() {
  app.innerHTML = base() +
    '<section class="hero"><div class="eyebrow">Laboratório de produtos digitais</div>' +
    '<h1>Dez ideias. Um primeiro passo.</h1>' +
    '<p>Uma coleção de ferramentas online pensadas para resolver tarefas específicas. Explore os protótipos e escolha qual vale validar com usuários primeiro.</p>' +
    '<a class="home-cta" href="#ideias">Explorar os conceitos <span class="arrow">↓</span></a></section>' +
    '<main id="ideias" class="grid">' +
    sites.map((site, index) =>
      '<a class="tile" href="' + site.slug + '/"><div class="tiletop"><div class="icon">' + site.icon + '</div>' +
      '<span class="category">' + esc(site.category) + '</span></div>' +
      '<h2>' + String(index + 1).padStart(2, '0') + ' · ' + esc(site.name) + '</h2>' +
      '<p>' + esc(site.tagline) + '</p><div class="tilefoot"><span>Abrir protótipo</span><span class="arrow">↗</span></div></a>'
    ).join('') +
    '</main>' + footer();
}

function readLocal(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeLocal(key, items) {
  localStorage.setItem(key, JSON.stringify(items.slice(0, 20)));
}

function fieldHtml(site) {
  const slug = site.slug;
  return site.fields.map((field, index) => {
    const name = 'f' + index;
    const label = esc(field.label);
    const placeholder = esc(field.placeholder);

    if (slug === '03-entrevista-fluente' && index === 1) {
      return '<label class="field"><span>' + label + '</span><textarea name="' + name + '" maxlength="1800" placeholder="' + placeholder + '" required></textarea></label>';
    }
    if (slug === '04-monta-pc' && index === 0) {
      return '<label class="field"><span>' + label + '</span><input name="' + name + '" type="number" min="1000" max="100000" step="100" placeholder="' + placeholder + '" required></label>';
    }
    if (slug === '04-monta-pc' && index === 2) {
      return '<label class="field"><span>' + label + '</span><select name="' + name + '"><option>1080p</option><option selected>1440p</option><option>4K</option></select></label>';
    }
    if (slug === '05-caça-game' && index === 1) {
      return '<label class="field"><span>' + label + '</span><input name="' + name + '" type="number" min="0" step="0.01" placeholder="' + placeholder + '" required></label>';
    }
    if (slug === '05-caça-game' && index === 2) {
      return '<label class="field"><span>' + label + '</span><select name="' + name + '"><option>PC</option><option>PlayStation</option><option>Xbox</option><option>Switch</option></select></label>';
    }
    if (slug === '07-perto-de-mim' && index === 1) {
      return '<label class="field"><span>' + label + '</span><select name="' + name + '"><option>Eletricista</option><option>Montador</option><option>Diarista</option><option>Reformas</option><option>Beleza</option><option>Aulas</option><option>Serviços domésticos</option></select></label>';
    }
    if (slug === '08-prato-pronto' && index === 0) {
      return '<label class="field"><span>' + label + '</span><input name="' + name + '" type="number" min="20" step="1" placeholder="' + placeholder + '" required></label>';
    }
    if (slug === '08-prato-pronto' && index === 1) {
      return '<label class="field"><span>' + label + '</span><input name="' + name + '" type="number" min="1" max="20" step="1" placeholder="' + placeholder + '" required></label>';
    }
    if (slug === '09-revisa-ai' && index === 1) {
      return '<label class="field"><span>' + label + '</span><input name="' + name + '" type="date" required></label>';
    }
    if (slug === '09-revisa-ai' && index === 2) {
      return '<label class="field"><span>' + label + '</span><input name="' + name + '" type="number" min="10" max="720" step="5" placeholder="' + placeholder + '" required></label>';
    }
    return '<label class="field"><span>' + label + '</span><input name="' + name + '" maxlength="500" placeholder="' + placeholder + '" required></label>';
  }).join('');
}

const adapters = {
  '02-vaga-certa': {
    async save(values, user) {
      const { error } = await supabaseClient.from('vagacerta_applications').insert({
        user_id: user.id,
        company: values[0],
        role: values[1],
        status: 'saved',
        notes: values[2]
      });
      if (error) throw error;
    },
    async load(user) {
      const { data, error } = await supabaseClient
        .from('vagacerta_applications')
        .select('id,company,role,status,notes,updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.company,
        meta: row.role + ' · ' + row.status,
        time: Date.parse(row.updated_at)
      }));
    }
  },
  '03-entrevista-fluente': {
    async save(values, user) {
      const { data: session, error: sessionError } = await supabaseClient
        .from('falapro_sessions')
        .insert({
          user_id: user.id,
          target_role: 'Entrevista de emprego',
          level: values[2],
          language: 'en',
          status: 'in_progress'
        })
        .select('id')
        .single();
      if (sessionError) throw sessionError;

      const { error } = await supabaseClient.from('falapro_answers').insert({
        user_id: user.id,
        session_id: session.id,
        question: values[0],
        answer: values[1],
        feedback: ''
      });
      if (error) throw error;
    },
    async load(user) {
      const { data, error } = await supabaseClient
        .from('falapro_answers')
        .select('id,question,answer,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.question,
        meta: row.answer.slice(0, 80),
        time: Date.parse(row.created_at)
      }));
    }
  },
  '04-monta-pc': {
    async save(values, user) {
      const budget = toCents(values[0]);
      const { error } = await supabaseClient.from('montapc_builds').insert({
        user_id: user.id,
        name: values[1] + ' · ' + values[2],
        budget_cents: budget,
        purpose: values[1] + ' | ' + values[2],
        total_cents: 0,
        compatibility_status: 'pending'
      });
      if (error) throw error;
    },
    async load(user) {
      const { data, error } = await supabaseClient
        .from('montapc_builds')
        .select('id,name,budget_cents,compatibility_status,updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.name,
        meta: moneyFromCents(row.budget_cents) + ' · ' + row.compatibility_status,
        time: Date.parse(row.updated_at)
      }));
    }
  },
  '05-caça-game': {
    async save(values, user) {
      const { error } = await supabaseClient.from('gameradar_custom_alerts').insert({
        user_id: user.id,
        title: values[0],
        target_price_cents: toCents(values[1]),
        platform: values[2],
        notify_enabled: true
      });
      if (error) throw error;
    },
    async load(user) {
      const { data, error } = await supabaseClient
        .from('gameradar_custom_alerts')
        .select('id,title,target_price_cents,platform,updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.title,
        meta: (row.platform || 'Plataforma') + ' · alvo ' + moneyFromCents(row.target_price_cents),
        time: Date.parse(row.updated_at)
      }));
    }
  },
  '07-perto-de-mim': {
    async search(values) {
      let query = supabaseClient
        .from('perto_professionals')
        .select('id,display_name,city,state,category,description,price_from_cents,rating')
        .eq('status', 'active')
        .ilike('city', '%' + values[0] + '%')
        .limit(12);

      if (values[1]) query = query.ilike('category', '%' + values[1] + '%');
      const { data, error } = await query;
      if (error) throw error;

      const term = values[2].toLocaleLowerCase('pt-BR');
      return (data || []).filter(row => {
        if (!term) return true;
        return [row.display_name, row.category, row.description]
          .some(value => String(value || '').toLocaleLowerCase('pt-BR').includes(term));
      });
    }
  },
  '08-prato-pronto': {
    async save(values, user) {
      const { error } = await supabaseClient.from('pratopronto_plans').insert({
        user_id: user.id,
        title: 'Plano semanal',
        weekly_budget_cents: toCents(values[0]),
        people: Number(values[1]),
        preferences: [values[2]],
        starts_on: new Date().toISOString().slice(0, 10)
      });
      if (error) throw error;
    },
    async load(user) {
      const { data, error } = await supabaseClient
        .from('pratopronto_plans')
        .select('id,title,weekly_budget_cents,people,preferences,updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.title,
        meta: moneyFromCents(row.weekly_budget_cents) + ' · ' + row.people + ' pessoa(s)',
        time: Date.parse(row.updated_at)
      }));
    }
  },
  '09-revisa-ai': {
    async save(values, user) {
      const { error } = await supabaseClient.from('revisa_goals').insert({
        user_id: user.id,
        exam_name: values[0],
        exam_date: values[1],
        study_minutes_per_day: Number(values[2])
      });
      if (error) throw error;
    },
    async load(user) {
      const { data, error } = await supabaseClient
        .from('revisa_goals')
        .select('id,exam_name,exam_date,study_minutes_per_day,updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        title: row.exam_name,
        meta: (row.exam_date || 'Sem data') + ' · ' + (row.study_minutes_per_day || 0) + ' min/dia',
        time: Date.parse(row.updated_at)
      }));
    }
  }
};

function baseResultHtml(site, values) {
  let title = 'Próximo passo salvo';
  let lines = [];

  switch (site.slug) {
    case '02-vaga-certa':
      title = 'Candidatura registrada';
      lines = [
        'Empresa: ' + values[0],
        'Cargo: ' + values[1],
        'Próxima ação: ' + values[2],
        'Dica: registre a data de candidatura e faça follow-up depois de alguns dias.'
      ];
      break;
    case '03-entrevista-fluente':
      title = 'Guia para revisar sua resposta';
      lines = [
        'Comece com uma resposta direta antes dos detalhes.',
        'Use um exemplo concreto de situação, ação e resultado.',
        'Leia em voz alta e corte frases longas que dificultem a fluidez.'
      ];
      break;
    case '04-monta-pc': {
      const budget = Number(values[0]) || 0;
      title = 'Distribuição inicial do orçamento';
      lines = [
        'GPU: aproximadamente 35% · R$ ' + Math.round(budget * 0.35),
        'CPU: aproximadamente 20% · R$ ' + Math.round(budget * 0.20),
        'Placa-mãe + memória: aproximadamente 20%',
        'Reserve o restante para fonte, SSD, gabinete e margem de preço.'
      ];
      break;
    }
    case '05-caça-game':
      title = 'Alerta adicionado';
      lines = [
        values[0] + ' · ' + values[2],
        'Preço alvo: R$ ' + values[1],
        'A consulta automática de lojas será ligada numa etapa posterior.'
      ];
      break;
    case '07-perto-de-mim':
      title = 'Busca realizada';
      lines = [
        'Cidade: ' + values[0],
        'Categoria: ' + values[1],
        'Termo: ' + values[2]
      ];
      break;
    case '08-prato-pronto':
      title = 'Sugestão de cardápio';
      lines = [
        'Segunda: arroz, feijão, ovo e salada da estação',
        'Terça: macarrão com legumes e proteína econômica',
        'Quarta: frango ou grão-de-bico com abóbora',
        'Quinta: sopa com reaproveitamento de legumes',
        'Sexta: omelete com acompanhamentos restantes'
      ];
      break;
    case '09-revisa-ai':
      title = 'Plano-base de revisão';
      lines = [
        'Divida ' + values[0] + ' em tópicos pequenos.',
        'Estude por ' + values[2] + ' minutos por dia em blocos de foco.',
        'Reserve os últimos dias antes de ' + values[1] + ' para exercícios e revisão espaçada.'
      ];
      break;
    default:
      title = 'Rascunho criado';
      lines = ['Continue refinando este protótipo na versão dedicada do produto.'];
  }

  return '<h4>' + esc(title) + '</h4><ul>' +
    lines.map(line => '<li>' + esc(line) + '</li>').join('') +
    '</ul>';
}

function professionalsHtml(rows) {
  if (!rows.length) {
    return '<h4>Nenhum profissional encontrado</h4><p>A base real ainda pode estar vazia nessa cidade/categoria. Tente ampliar a busca.</p>';
  }

  return '<h4>' + rows.length + ' profissional(is) encontrado(s)</h4><div class="professional-results">' +
    rows.map(row =>
      '<article class="professional-card"><strong>' + esc(row.display_name) + '</strong>' +
      '<span>' + esc(row.category) + ' · ' + esc(row.city) + '/' + esc(row.state) + '</span>' +
      (row.rating !== null ? '<small>★ ' + Number(row.rating).toFixed(1) + '</small>' : '') +
      (row.price_from_cents !== null ? '<small>A partir de ' + moneyFromCents(row.price_from_cents) + '</small>' : '') +
      (row.description ? '<p>' + esc(row.description) + '</p>' : '') +
      '</article>'
    ).join('') +
    '</div>';
}

function renderSite(site) {
  document.title = site.name + ' — ideias+';
  const key = 'ideias-plus-' + site.slug;
  const adapter = adapters[site.slug] || null;
  let localSaved = readLocal(key);
  let cloudSaved = [];
  let currentUser = null;

  app.innerHTML = base() +
    '<header class="apphead"><a class="back" href="../">← Todos os conceitos</a>' +
    '<div class="appbrand">' + esc(site.name) + '</div>' +
    '<span class="pill">' + (adapter ? 'Fullstack' : 'Protótipo') + '</span>' +
    (adapter ? '<button class="account-trigger" id="account-open" type="button">Entrar / sincronizar</button>' : '') +
    '</header>' +
    '<main class="layout"><section class="panel mainpanel"><div class="badge">' + site.icon + ' ' + esc(site.category) + '</div>' +
    '<h1>' + esc(site.title) + '</h1><p class="lead">' + esc(site.intro) + '</p>' +
    '<form id="toolform">' + fieldHtml(site) +
    '<button class="primary" type="submit">' + esc(site.button) + ' <span>→</span></button></form>' +
    '<div class="result" id="result"></div></section>' +
    '<aside class="panel side"><h3>Seu espaço de trabalho</h3>' +
    '<p id="workspace-note">' + (adapter ? 'Sem conta, os registros ficam neste navegador. Entre para sincronizar este produto no backend.' : 'Este protótipo continua local; a versão dedicada do produto é desenvolvida em outro repositório.') + '</p>' +
    '<div class="saved" id="saved"></div>' +
    '<p class="note">Dados privados ficam protegidos por RLS no backend. Nunca colocamos service_role no navegador.</p></aside></main>' +
    footer() +
    '<div class="toast" id="toast" role="status" aria-live="polite"></div>' +
    (adapter ? '<dialog class="account-dialog" id="account-dialog"><div class="account-head"><div><strong>Conta ' + esc(site.name) + '</strong><span>Sincronize seus registros entre dispositivos.</span></div><button id="account-close" type="button" aria-label="Fechar">×</button></div>' +
      '<form id="auth-form"><label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="email" required></label><label class="field"><span>Senha</span><input name="password" type="password" autocomplete="current-password" minlength="8" required></label><button class="primary" type="submit">Entrar</button><div class="account-actions"><button id="sign-up" type="button">Criar conta</button><button id="sign-out" type="button" hidden>Sair</button></div></form><p id="account-message" class="account-message"></p></dialog>' : '');

  const savedEl = document.querySelector('#saved');
  const result = document.querySelector('#result');
  const toast = document.querySelector('#toast');
  const form = document.querySelector('#toolform');

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('on');
    setTimeout(() => toast.classList.remove('on'), 1800);
  }

  function list() {
    localSaved = readLocal(key);
    const source = currentUser && adapter?.load ? cloudSaved : localSaved;
    savedEl.innerHTML = source.length
      ? '<h3>Recentes · ' + source.length + '</h3>' +
        source.slice(0, 6).map(item =>
          '<div class="entry"><strong>' + esc(item.title) + '</strong><small>' + esc(item.meta) + ' · ' +
          new Date(item.time).toLocaleDateString('pt-BR') + '</small></div>'
        ).join('')
      : '<div class="result show"><h4>Comece por aqui</h4><p>Seus itens recentes aparecerão nesta lista.</p></div>';
  }

  async function loadCloud() {
    if (!currentUser || !adapter?.load) return;
    try {
      cloudSaved = await adapter.load(currentUser);
      list();
      document.querySelector('#workspace-note').textContent = 'Sincronizado com sua conta. Os registros abaixo vêm do backend.';
    } catch (error) {
      console.error(error);
      showToast('Não foi possível carregar a nuvem.');
    }
  }

  function updateAuthUi() {
    if (!adapter) return;
    const trigger = document.querySelector('#account-open');
    const signOut = document.querySelector('#sign-out');
    const authForm = document.querySelector('#auth-form');
    trigger.textContent = currentUser ? 'Minha conta' : 'Entrar / sincronizar';
    signOut.hidden = !currentUser;
    authForm.elements.email.disabled = Boolean(currentUser);
    authForm.elements.password.disabled = Boolean(currentUser);
    authForm.querySelector('[type="submit"]').hidden = Boolean(currentUser);
    document.querySelector('#account-message').textContent = currentUser
      ? 'Conectado como ' + (currentUser.email || 'usuário')
      : 'Entre ou crie uma conta para sincronizar.';
  }

  if (adapter) {
    const dialog = document.querySelector('#account-dialog');
    document.querySelector('#account-open').addEventListener('click', () => dialog.showModal());
    document.querySelector('#account-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });

    document.querySelector('#auth-form').addEventListener('submit', async event => {
      event.preventDefault();
      if (!supabaseClient) return;
      const submit = event.currentTarget.querySelector('[type="submit"]');
      submit.disabled = true;
      document.querySelector('#account-message').textContent = 'Entrando…';
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: event.currentTarget.elements.email.value.trim(),
        password: event.currentTarget.elements.password.value
      });
      submit.disabled = false;
      if (error) document.querySelector('#account-message').textContent = 'Não foi possível entrar. Confira e-mail e senha.';
    });

    document.querySelector('#sign-up').addEventListener('click', async () => {
      if (!supabaseClient) return;
      const formEl = document.querySelector('#auth-form');
      const email = formEl.elements.email.value.trim();
      const password = formEl.elements.password.value;
      if (!email || password.length < 8) {
        document.querySelector('#account-message').textContent = 'Use um e-mail válido e senha com pelo menos 8 caracteres.';
        return;
      }
      const { data, error } = await supabaseClient.auth.signUp({ email, password });
      document.querySelector('#account-message').textContent = error
        ? 'Não foi possível criar a conta.'
        : (data.session ? 'Conta criada e conectada.' : 'Conta criada. Confirme seu e-mail e depois entre.');
    });

    document.querySelector('#sign-out').addEventListener('click', async () => {
      if (!supabaseClient) return;
      await supabaseClient.auth.signOut();
    });

    if (!supabaseClient) {
      document.querySelector('#account-open').disabled = true;
      document.querySelector('#workspace-note').textContent = 'Backend indisponível nesta página; o modo local continua funcionando.';
    } else {
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        setTimeout(() => {
          currentUser = session?.user || null;
          cloudSaved = [];
          updateAuthUi();
          if (currentUser) loadCloud();
          else {
            document.querySelector('#workspace-note').textContent = 'Sem conta, os registros ficam neste navegador. Entre para sincronizar este produto no backend.';
            list();
          }
        }, 0);
      });

      supabaseClient.auth.getSession().then(({ data }) => {
        currentUser = data.session?.user || null;
        updateAuthUi();
        if (currentUser) loadCloud();
      });
    }
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const values = [...event.currentTarget.elements]
      .filter(element => element.name)
      .map(element => element.value.trim());

    if (values.some(value => !value)) {
      showToast('Preencha os campos para continuar.');
      return;
    }

    const localItem = {
      title: values[0],
      meta: values.slice(1).join(' · '),
      time: Date.now()
    };
    localSaved.unshift(localItem);
    writeLocal(key, localSaved);

    let customHtml = '';
    if (adapter?.search && supabaseClient) {
      try {
        const rows = await adapter.search(values);
        customHtml = professionalsHtml(rows);
      } catch (error) {
        console.error(error);
        customHtml = '<h4>Busca indisponível</h4><p>Não foi possível consultar a base agora. Tente novamente.</p>';
      }
    }

    if (adapter?.save && currentUser && supabaseClient) {
      const submit = event.currentTarget.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        await adapter.save(values, currentUser);
        await loadCloud();
        showToast('Salvo e sincronizado.');
      } catch (error) {
        console.error(error);
        showToast('Salvo localmente; falha ao sincronizar.');
      } finally {
        submit.disabled = false;
      }
    } else {
      list();
      showToast(adapter?.save ? 'Salvo neste navegador.' : 'Busca registrada.');
    }

    result.innerHTML = customHtml || baseResultHtml(site, values);
    result.classList.add('show');
  });

  list();
  if (adapter) updateAuthUi();
}

if (home) {
  renderHome();
} else {
  const slug = document.body.dataset.site;
  const site = sites.find(item => item.slug === slug);
  site ? renderSite(site) : renderHome();
}
