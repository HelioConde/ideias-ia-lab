(() => {
  const form = document.querySelector('#riot-form');
  const landing = document.querySelector('#landing-view');
  const profile = document.querySelector('#profile-view');
  const gameNameInput = document.querySelector('#game-name');
  const tagLineInput = document.querySelector('#tag-line');
  const platformInput = document.querySelector('#region');
  const feedback = document.querySelector('#form-feedback');
  const toast = document.querySelector('#toast');
  const profileRiotId = document.querySelector('#profile-riot-id');
  const shareRiotId = document.querySelector('#share-riot-id');
  const backButton = document.querySelector('#back-to-search');
  const sourceBadge = document.querySelector('#demo-badge');
  const sourceNote = document.querySelector('#data-source-note');
  const backend = window.RIOT_LEGACY_BACKEND || {};

  const demo = {
    mastery: 684210,
    games: 1284,
    years: 8,
    tftBest: 'Top 2',
    placements: [1, 2, 2, 3, 4, 2, 1, 5],
    board: [
      ['A', 'L', '', '', 'S', '', ''],
      ['', '', 'M', '', '', 'N', ''],
      ['', 'K', '', 'A', '', '', ''],
      ['', '', '', '', '', '', '']
    ],
    traits: ['Arcana', 'Scholar', 'Bastion'],
    champions: [
      { name: 'Ahri', games: 42, avgKda: 3.8 },
      { name: 'Lux', games: 18, avgKda: 3.2 },
      { name: 'Syndra', games: 11, avgKda: 2.9 }
    ]
  };

  let live = { lol: null, tft: null };
  let currentLookup = null;
  let lookupSequence = 0;

  function locale() {
    return window.RiotLegacyI18n?.locale?.() || 'pt-BR';
  }

  function t(key) {
    return window.RiotLegacyI18n?.t?.(key) || key;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function showToast(messageKey) {
    toast.textContent = t(messageKey);
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function normalizedId(gameName, tagLine) {
    return `${String(gameName || '').trim()}#${String(tagLine || '').trim().replace(/^#/, '')}`;
  }

  function validInput(gameName, tagLine) {
    const gn = String(gameName || '').trim();
    const tl = String(tagLine || '').trim().replace(/^#/, '');
    return gn.length >= 3 && gn.length <= 16 && /^[A-Za-z0-9\p{L} ._-]+$/u.test(gn) &&
      tl.length >= 3 && tl.length <= 5 && /^[A-Za-z0-9]+$/.test(tl);
  }

  function formatNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString(locale()) : '—';
  }

  function platformRegion(platform) {
    if (['br1', 'na1', 'la1', 'la2'].includes(platform)) return 'americas';
    if (['kr', 'jp1'].includes(platform)) return 'asia';
    if (['oc1'].includes(platform)) return 'sea';
    return 'europe';
  }

  function platformFromLegacyRegion(region) {
    return ({ americas: 'br1', europe: 'euw1', asia: 'kr', sea: 'oc1' })[region] || 'br1';
  }

  function cleanTftName(value) {
    return String(value || '')
      .replace(/^TFT\d+_/i, '')
      .replace(/^Set\d+_/i, '')
      .replace(/^TFT_Item_/i, '')
      .replace(/_/g, ' ')
      .trim() || 'TFT';
  }

  function currentSignatureChampion() {
    return live.lol?.championSummaries?.[0]?.name || demo.champions[0].name;
  }

  function currentMasteryPoints() {
    return live.lol?.mastery?.[0]?.points || demo.mastery;
  }

  function currentLolMatches() {
    return Array.isArray(live.lol?.matches) ? live.lol.matches : [];
  }

  function currentTftMatches() {
    return Array.isArray(live.tft?.matches) ? live.tft.matches : [];
  }

  function setSourceState(state, detail = '') {
    sourceBadge.dataset.sourceState = state;
    sourceBadge.classList.toggle('live', state === 'live');
    sourceBadge.classList.toggle('partial', state === 'partial');
    sourceBadge.classList.toggle('loading', state === 'loading');

    const english = locale() === 'en';
    if (state === 'loading') {
      sourceBadge.textContent = english ? 'CHECKING RIOT…' : 'CONSULTANDO RIOT…';
      sourceNote.textContent = english
        ? 'Loading public League and TFT data from the shared gamer backend.'
        : 'Carregando dados públicos de League e TFT pelo backend gamer compartilhado.';
      return;
    }

    if (state === 'live') {
      sourceBadge.textContent = english ? 'RIOT DATA · LOL + TFT' : 'DADOS RIOT · LOL + TFT';
      sourceNote.textContent = english
        ? detail || 'League and TFT use Riot-backed data. The long-term timeline remains demonstrative until historical snapshots exist.'
        : detail || 'League e TFT usam dados vindos da Riot. A timeline de longo prazo continua demonstrativa até existirem snapshots históricos.';
      return;
    }

    if (state === 'partial') {
      sourceBadge.textContent = english ? 'PARTIAL RIOT DATA' : 'DADOS RIOT PARCIAIS';
      sourceNote.textContent = detail || (english
        ? 'One game has live Riot data; the unavailable section keeps the clearly identified demo fallback.'
        : 'Um dos jogos tem dados Riot reais; a seção indisponível mantém o fallback demo claramente identificado.');
      return;
    }

    sourceBadge.textContent = english ? 'DEMONSTRATIVE FALLBACK' : 'FALLBACK DEMONSTRATIVO';
    sourceNote.textContent = detail || (english
      ? 'The Riot backend did not return usable data for this lookup. The visual prototype remains available with demonstrative data.'
      : 'O backend Riot não retornou dados utilizáveis para esta busca. O protótipo visual continua disponível com dados demonstrativos.');
  }

  async function postPublicFunction(url, body) {
    if (!url) throw new Error('backend_not_configured');
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 14000);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      let data = null;
      try { data = await response.json(); } catch {}
      if (!response.ok || data?.error) {
        const error = new Error(data?.message || 'riot_lookup_failed');
        error.code = data?.error || String(response.status);
        error.status = response.status;
        throw error;
      }
      return data;
    } finally {
      window.clearTimeout(timer);
    }
  }

  function renderBoard() {
    const board = document.querySelector('#tft-board');
    const label = document.querySelector('#board-label');
    const latest = currentTftMatches()[0];
    const liveUnits = Array.isArray(latest?.units) ? latest.units.slice(0, 12) : [];

    if (live.tft && liveUnits.length) {
      label.textContent = locale() === 'en' ? 'Units from latest match' : 'Unidades da partida mais recente';
      const cells = Array.from({ length: 28 }, (_, index) => {
        const unit = liveUnits[index];
        if (!unit) return '';
        const name = cleanTftName(unit.characterId);
        return { short: name.slice(0, 1).toUpperCase(), name, tier: Number(unit.tier || 0) };
      });
      board.innerHTML = cells.map((unit, index) => {
        if (!unit) return `<span class="hex-cell" aria-label="Empty" data-cell="${index}"></span>`;
        return `<span class="hex-cell filled" title="${escapeHtml(unit.name)}" aria-label="${escapeHtml(unit.name)}" data-cell="${index}">${escapeHtml(unit.short)}<small>${unit.tier ? '★'.repeat(Math.min(3, unit.tier)) : ''}</small></span>`;
      }).join('');
      return;
    }

    label.textContent = t('board_label');
    board.innerHTML = demo.board.flatMap((row, rowIndex) =>
      row.map((value, colIndex) => {
        const filled = Boolean(value);
        return `<span class="hex-cell${filled ? ' filled' : ''}" aria-label="${filled ? 'Unit ' + value : 'Empty'}" data-row="${rowIndex}" data-col="${colIndex}">${value}</span>`;
      })
    ).join('');
  }

  function renderTraits() {
    const el = document.querySelector('#trait-list');
    const latest = currentTftMatches()[0];
    const traits = live.tft && Array.isArray(latest?.traits)
      ? latest.traits
        .filter(item => Number(item?.numUnits || 0) > 0 && (Number(item?.style || 0) > 0 || Number(item?.numUnits || 0) >= 2))
        .sort((a, b) => Number(b.style || 0) - Number(a.style || 0) || Number(b.numUnits || 0) - Number(a.numUnits || 0))
        .slice(0, 6)
        .map(item => cleanTftName(item.name))
      : demo.traits;
    el.innerHTML = traits.map(name => `<span class="trait">${escapeHtml(name)}</span>`).join('');
  }

  function renderPlacementBars() {
    const el = document.querySelector('#placement-bars');
    const placements = live.tft
      ? currentTftMatches().map(match => Number(match.placement)).filter(value => value >= 1 && value <= 8)
      : demo.placements;
    const counts = Array.from({ length: 8 }, (_, index) =>
      placements.filter(value => value === index + 1).length
    );
    const max = Math.max(...counts, 1);
    el.innerHTML = counts.map((count, index) =>
      `<div class="placement-bar"><span style="height:${Math.max(8, Math.round((count / max) * 100))}%"></span><small>${index + 1}</small></div>`
    ).join('');
  }

  function renderChampions() {
    const el = document.querySelector('#champion-list');
    const champions = live.lol && Array.isArray(live.lol.championSummaries) && live.lol.championSummaries.length
      ? live.lol.championSummaries.slice(0, 3)
      : demo.champions;

    el.innerHTML = champions.map(champion => {
      const name = String(champion.name || 'Champion');
      const games = Number(champion.games || 0);
      const detail = live.lol
        ? `${games} ${locale() === 'en' ? (games === 1 ? 'match' : 'matches') : (games === 1 ? 'partida' : 'partidas')}${champion.avgKda != null ? ' · KDA ' + Number(champion.avgKda).toLocaleString(locale(), { maximumFractionDigits: 2 }) : ''}`
        : `${formatNumber(champion.games === 42 ? demo.mastery : champion.games * 18000)} mastery`;
      return `<div class="champion"><div class="portrait">${escapeHtml(name.slice(0, 1).toUpperCase())}</div><h3>${escapeHtml(name)}</h3><span>${escapeHtml(detail)}</span></div>`;
    }).join('');
  }

  function renderRoles() {
    const stack = document.querySelector('#role-stack');
    if (!live.lol) {
      stack.innerHTML = `
        <div class="role-row"><span>${t('role_mid')}</span><div class="role-track"><div class="role-fill" style="width:68%"></div></div><b>68%</b></div>
        <div class="role-row"><span>${t('role_support')}</span><div class="role-track"><div class="role-fill" style="width:22%"></div></div><b>22%</b></div>
        <div class="role-row"><span>${t('role_other')}</span><div class="role-track"><div class="role-fill" style="width:10%"></div></div><b>10%</b></div>`;
      return;
    }

    const labels = { TOP: 'Top', JUNGLE: 'Jungle', MID: 'Mid', ADC: 'ADC', SUPPORT: locale() === 'en' ? 'Support' : 'Suporte' };
    const counts = {};
    currentLolMatches().forEach(match => {
      const position = String(match.position || '');
      if (position) counts[position] = (counts[position] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = entries.reduce((sum, [, count]) => sum + count, 0) || 1;
    stack.innerHTML = entries.length
      ? entries.map(([position, count]) => {
          const percent = Math.round(count / total * 100);
          return `<div class="role-row"><span>${escapeHtml(labels[position] || position)}</span><div class="role-track"><div class="role-fill" style="width:${percent}%"></div></div><b>${percent}%</b></div>`;
        }).join('')
      : `<p class="empty-inline">${locale() === 'en' ? 'No Summoner’s Rift role sample available.' : 'Sem amostra de função em Summoner’s Rift.'}</p>`;
  }

  function renderSignature() {
    const champion = currentSignatureChampion();
    const games = Number(live.lol?.championSummaries?.[0]?.games || 0);
    const position = live.lol?.summary?.primaryPosition || live.lol?.summary?.mainContext || 'MID';
    const rank = live.lol?.ranked?.[0];
    const rankLabel = rank?.tier ? `${rank.tier} ${rank.rank || ''}`.trim() : position;
    const title = document.querySelector('#signature-title');
    const text = document.querySelector('#signature-text');
    const chip = document.querySelector('#signature-chip');

    if (live.lol) {
      title.textContent = locale() === 'en'
        ? `${champion} is your recent signature`
        : `${champion} é sua assinatura recente`;
      text.textContent = locale() === 'en'
        ? `Across the ${live.lol.summary?.matches || currentLolMatches().length} recent matches analyzed by Riot Legacy, ${champion} is the champion that appears most often. This is a recent-data signal, not a claim about your entire account history.`
        : `Nas ${live.lol.summary?.matches || currentLolMatches().length} partidas recentes analisadas pelo Riot Legacy, ${champion} é o campeão que mais aparece. Este é um sinal da amostra recente, não uma afirmação sobre todo o histórico da conta.`;
      chip.textContent = `${rankLabel.toUpperCase()} · ${games} ${locale() === 'en' ? 'GAMES' : 'JOGOS'} · ${champion.toUpperCase()}`;
    } else {
      title.textContent = t('signature_title');
      text.textContent = t('signature_text');
      chip.textContent = 'MID · 684K · AHRI';
    }

    const bg = document.querySelector('.profile-hero-bg');
    const safeChampion = /^[A-Za-z0-9]+$/.test(champion) ? champion : 'Ahri';
    bg.style.backgroundImage = `linear-gradient(90deg,rgba(5,10,16,.98) 5%,rgba(5,10,16,.78) 45%,rgba(5,10,16,.22)),linear-gradient(0deg,#050a10 0%,transparent 45%),url("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${safeChampion}_0.jpg")`;
  }

  function renderDynamicCopy() {
    const mastery = currentMasteryPoints();
    const lolMatches = live.lol?.summary?.matches;
    const winRate = live.lol?.summary?.winRate;
    const tftTop4 = live.tft?.summary?.top4Rate;
    const averagePlacement = live.tft?.summary?.averagePlacement;

    document.querySelector('#metric-mastery').textContent = formatNumber(mastery);
    document.querySelector('#metric-games').textContent = formatNumber(lolMatches ?? demo.games);

    const gamesLabel = document.querySelector('[data-i18n="games"]');
    if (gamesLabel) gamesLabel.textContent = live.lol
      ? (locale() === 'en' ? 'LoL matches analyzed' : 'Partidas LoL analisadas')
      : t('games');

    const thirdLabel = document.querySelector('#metric-third-label');
    thirdLabel.textContent = live.lol ? (locale() === 'en' ? 'Recent win rate' : 'Win rate recente') : t('years');
    document.querySelector('#metric-years').textContent = live.lol && winRate != null ? `${winRate}%` : String(demo.years);

    const tftLabel = document.querySelector('#metric-tft-label');
    tftLabel.textContent = live.tft ? (locale() === 'en' ? 'TFT Top 4 rate' : 'Top 4 no TFT') : t('top_finish');
    document.querySelector('#metric-tft').textContent = live.tft && tftTop4 != null ? `${tftTop4}%` : demo.tftBest;
    document.querySelector('#tft-average').textContent = live.tft && averagePlacement != null
      ? Number(averagePlacement).toLocaleString(locale(), { maximumFractionDigits: 2 })
      : (demo.placements.reduce((a, b) => a + b, 0) / demo.placements.length).toLocaleString(locale(), { maximumFractionDigits: 1 });

    const champion = currentSignatureChampion();
    document.querySelector('#share-signature').textContent = live.lol
      ? (locale() === 'en' ? `${champion} · recent signature` : `${champion} · assinatura recente`)
      : t('share_card_signature');
    document.querySelector('#share-mastery').textContent = `${formatNumber(mastery)} mastery`;
    document.querySelector('#share-tft').textContent = live.tft
      ? `TFT · Top 4 ${tftTop4 ?? '—'}%`
      : t('share_card_tft');

    renderSignature();
    renderChampions();
    renderRoles();
    renderBoard();
    renderTraits();
    renderPlacementBars();
  }

  function setProfileIdentity(riotId) {
    profileRiotId.textContent = riotId;
    shareRiotId.textContent = riotId;
    document.querySelector('#avatar-letter').textContent = riotId.charAt(0).toUpperCase();
  }

  function showProfile(gameName, tagLine, platform = 'br1', updateUrl = true) {
    const riotId = normalizedId(gameName, tagLine);
    currentLookup = { gameName: String(gameName).trim(), tagLine: String(tagLine).replace(/^#/, '').trim(), platform };
    live = { lol: null, tft: null };
    setProfileIdentity(riotId);
    landing.hidden = true;
    profile.hidden = false;
    document.body.classList.add('profile-mode');
    setSourceState('loading');
    renderDynamicCopy();
    activateTab('legacy');

    if (updateUrl) {
      const params = new URLSearchParams();
      params.set('riotId', riotId);
      params.set('server', platform);
      history.replaceState({}, '', `?${params.toString()}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    loadLiveProfile(currentLookup);
  }

  async function loadLiveProfile(lookup) {
    const sequence = ++lookupSequence;
    const region = platformRegion(lookup.platform);
    const common = {
      gameName: lookup.gameName,
      tagLine: lookup.tagLine,
      platform: lookup.platform
    };

    const [lolResult, tftResult] = await Promise.allSettled([
      postPublicFunction(backend.lolProfile, { ...common, region, limit: 20, matchLimit: 20 }),
      postPublicFunction(backend.tftProfile, common)
    ]);

    if (sequence !== lookupSequence || !currentLookup ||
        currentLookup.gameName !== lookup.gameName ||
        currentLookup.tagLine !== lookup.tagLine ||
        currentLookup.platform !== lookup.platform) return;

    const lol = lolResult.status === 'fulfilled' ? lolResult.value : null;
    const tft = tftResult.status === 'fulfilled' ? tftResult.value : null;
    live = { lol, tft };

    const canonical = lol?.player || tft?.player;
    if (canonical?.gameName && canonical?.tagLine) {
      setProfileIdentity(normalizedId(canonical.gameName, canonical.tagLine));
    }

    renderDynamicCopy();

    const lolCount = Number(lol?.summary?.matches || 0);
    const tftCount = Number(tft?.summary?.matches || 0);
    if (lol && tft) {
      const detail = locale() === 'en'
        ? `Riot data loaded: ${lolCount} recent LoL matches and ${tftCount} TFT matches. The long-term timeline is still demonstrative.`
        : `Dados Riot carregados: ${lolCount} partidas recentes de LoL e ${tftCount} partidas de TFT. A timeline de longo prazo ainda é demonstrativa.`;
      setSourceState('live', detail);
      return;
    }

    if (lol || tft) {
      const available = lol ? 'LoL' : 'TFT';
      const missing = lol ? 'TFT' : 'LoL';
      const detail = locale() === 'en'
        ? `Live ${available} data loaded. ${missing} is using the demonstrative fallback for this lookup.`
        : `Dados reais de ${available} carregados. ${missing} usa o fallback demonstrativo nesta busca.`;
      setSourceState('partial', detail);
      return;
    }

    const errors = [lolResult, tftResult]
      .filter(result => result.status === 'rejected')
      .map(result => result.reason?.code)
      .filter(Boolean);
    const notFound = errors.includes('player') || errors.includes('player_not_found');
    setSourceState('demo', notFound
      ? (locale() === 'en'
          ? 'Riot ID was not found by the live backend. The visual demo remains available.'
          : 'O Riot ID não foi encontrado pelo backend ao vivo. O protótipo visual continua disponível.')
      : '');
  }

  function showLanding() {
    lookupSequence++;
    currentLookup = null;
    live = { lol: null, tft: null };
    profile.hidden = true;
    landing.hidden = false;
    document.body.classList.remove('profile-mode');
    history.replaceState({}, '', location.pathname);
    window.scrollTo({ top: 0, behavior: 'instant' });
    gameNameInput.focus();
  }

  function activateTab(tab) {
    document.querySelectorAll('[data-tab]').forEach(button => {
      const active = button.dataset.tab === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('[data-panel]').forEach(panel => {
      panel.hidden = panel.dataset.panel !== tab;
    });
  }

  function currentShareUrl() {
    return location.href;
  }

  function shareText() {
    const riotId = profileRiotId.textContent;
    const champion = currentSignatureChampion();
    const mastery = currentMasteryPoints();
    if (live.lol || live.tft) {
      return locale() === 'en'
        ? `${riotId} · Riot Legacy — ${champion} as recent LoL signature, ${formatNumber(mastery)} mastery and a Riot-backed LoL + TFT snapshot.`
        : `${riotId} · Riot Legacy — ${champion} como assinatura recente no LoL, ${formatNumber(mastery)} de maestria e um retrato LoL + TFT com dados Riot.`;
    }
    return locale() === 'en'
      ? `${riotId} · Riot Legacy — Ahri signature champion, ${formatNumber(demo.mastery)} mastery and a demonstrative League + TFT story.`
      : `${riotId} · Riot Legacy — Ahri como campeã assinatura, ${formatNumber(demo.mastery)} de maestria e uma história demonstrativa entre League + TFT.`;
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentShareUrl());
      showToast('copied');
    } catch {
      showToast('share_ready');
    }
  }

  async function shareLegacy() {
    const payload = {
      title: 'Riot Legacy · ' + profileRiotId.textContent,
      text: shareText(),
      url: currentShareUrl()
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${payload.text}\n${payload.url}`);
      showToast('share_ready');
    } catch {
      showToast('share_ready');
    }
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const gameName = gameNameInput.value;
    const tagLine = tagLineInput.value;
    if (!validInput(gameName, tagLine)) {
      feedback.textContent = t('invalid_id');
      feedback.hidden = false;
      return;
    }
    feedback.hidden = true;
    showProfile(gameName, tagLine, platformInput.value);
  });

  backButton.addEventListener('click', showLanding);

  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
  });

  document.querySelector('#copy-link').addEventListener('click', copyLink);
  document.querySelector('#share-legacy').addEventListener('click', shareLegacy);
  document.querySelector('#share-card-action').addEventListener('click', shareLegacy);

  window.addEventListener('riot-legacy-language', () => {
    renderDynamicCopy();
    if (currentLookup) {
      const state = sourceBadge.dataset.sourceState || 'demo';
      if (state === 'loading') setSourceState('loading');
      else if (state === 'live') {
        const lolCount = Number(live.lol?.summary?.matches || 0);
        const tftCount = Number(live.tft?.summary?.matches || 0);
        setSourceState('live', locale() === 'en'
          ? `Riot data loaded: ${lolCount} recent LoL matches and ${tftCount} TFT matches. The long-term timeline is still demonstrative.`
          : `Dados Riot carregados: ${lolCount} partidas recentes de LoL e ${tftCount} partidas de TFT. A timeline de longo prazo ainda é demonstrativa.`);
      } else if (state === 'partial') {
        const available = live.lol ? 'LoL' : 'TFT';
        const missing = live.lol ? 'TFT' : 'LoL';
        setSourceState('partial', locale() === 'en'
          ? `Live ${available} data loaded. ${missing} is using the demonstrative fallback for this lookup.`
          : `Dados reais de ${available} carregados. ${missing} usa o fallback demonstrativo nesta busca.`);
      } else setSourceState('demo');
    }
    if (!feedback.hidden) feedback.textContent = t('invalid_id');
  });

  const params = new URLSearchParams(location.search);
  const deepId = params.get('riotId');
  if (deepId && deepId.includes('#')) {
    const index = deepId.lastIndexOf('#');
    const gameName = deepId.slice(0, index);
    const tagLine = deepId.slice(index + 1);
    const platform = params.get('server') || platformFromLegacyRegion(params.get('region'));
    gameNameInput.value = gameName;
    tagLineInput.value = tagLine;
    platformInput.value = [...platformInput.options].some(option => option.value === platform) ? platform : 'br1';
    showProfile(gameName, tagLine, platformInput.value, false);
  }
})();
