(() => {
  const form = document.querySelector('#riot-form');
  const landing = document.querySelector('#landing-view');
  const profile = document.querySelector('#profile-view');
  const gameNameInput = document.querySelector('#game-name');
  const tagLineInput = document.querySelector('#tag-line');
  const regionInput = document.querySelector('#region');
  const feedback = document.querySelector('#form-feedback');
  const toast = document.querySelector('#toast');
  const profileRiotId = document.querySelector('#profile-riot-id');
  const shareRiotId = document.querySelector('#share-riot-id');
  const backButton = document.querySelector('#back-to-search');

  const demo = {
    since: 2018,
    mastery: 684210,
    games: 1284,
    years: 8,
    tftBest: 'Top 2',
    placements: [1, 2, 2, 3, 4, 2, 1, 5],
    traits: ['Feiticeiro', 'Arcana', 'Guardião'],
    board: [
      ['A', 'L', '', '', 'S', '', ''],
      ['', '', 'M', '', '', 'N', ''],
      ['', 'K', '', 'A', '', '', ''],
      ['', '', '', '', '', '', '']
    ]
  };

  function t(key) {
    return window.RiotLegacyI18n?.t?.(key) || key;
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
    return String(gameName || '').trim().length >= 2 && String(tagLine || '').trim().replace(/^#/, '').length >= 2;
  }

  function formatNumber(value) {
    return Number(value).toLocaleString(window.RiotLegacyI18n?.locale?.() || 'pt-BR');
  }

  function renderBoard() {
    const board = document.querySelector('#tft-board');
    board.innerHTML = demo.board.flatMap((row, rowIndex) =>
      row.map((value, colIndex) => {
        const filled = Boolean(value);
        return `<span class="hex-cell${filled ? ' filled' : ''}" aria-label="${filled ? 'Unit ' + value : 'Empty'}" data-row="${rowIndex}" data-col="${colIndex}">${value}</span>`;
      })
    ).join('');
  }

  function renderPlacementBars() {
    const el = document.querySelector('#placement-bars');
    const counts = Array.from({ length: 8 }, (_, index) =>
      demo.placements.filter(value => value === index + 1).length
    );
    const max = Math.max(...counts, 1);
    el.innerHTML = counts.map((count, index) =>
      `<div class="placement-bar"><span style="height:${Math.max(8, Math.round((count / max) * 100))}%"></span><small>${index + 1}</small></div>`
    ).join('');
  }

  function renderDynamicCopy() {
    document.querySelector('#metric-mastery').textContent = formatNumber(demo.mastery);
    document.querySelector('#metric-games').textContent = formatNumber(demo.games);
    document.querySelector('#metric-years').textContent = String(demo.years);
    document.querySelector('#metric-tft').textContent = demo.tftBest;
    document.querySelector('#tft-average').textContent = (demo.placements.reduce((a, b) => a + b, 0) / demo.placements.length).toLocaleString(
      window.RiotLegacyI18n?.locale?.() || 'pt-BR',
      { maximumFractionDigits: 1 }
    );
  }

  function setProfileIdentity(riotId) {
    profileRiotId.textContent = riotId;
    shareRiotId.textContent = riotId;
    document.querySelector('#avatar-letter').textContent = riotId.charAt(0).toUpperCase();
  }

  function showProfile(gameName, tagLine, region = 'americas', updateUrl = true) {
    const riotId = normalizedId(gameName, tagLine);
    setProfileIdentity(riotId);
    landing.hidden = true;
    profile.hidden = false;
    document.body.classList.add('profile-mode');
    renderDynamicCopy();
    renderBoard();
    renderPlacementBars();
    activateTab('legacy');
    if (updateUrl) {
      const params = new URLSearchParams();
      params.set('riotId', riotId);
      params.set('region', region);
      history.replaceState({}, '', `?${params.toString()}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function showLanding() {
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
    return window.RiotLegacyI18n?.locale?.() === 'en'
      ? `${riotId} · Riot Legacy — Ahri signature champion, ${formatNumber(demo.mastery)} mastery and a story across League + TFT.`
      : `${riotId} · Riot Legacy — Ahri como campeã assinatura, ${formatNumber(demo.mastery)} de maestria e uma história entre League + TFT.`;
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
    showProfile(gameName, tagLine, regionInput.value);
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
    if (!feedback.hidden) feedback.textContent = t('invalid_id');
  });

  const params = new URLSearchParams(location.search);
  const deepId = params.get('riotId');
  if (deepId && deepId.includes('#')) {
    const index = deepId.lastIndexOf('#');
    const gameName = deepId.slice(0, index);
    const tagLine = deepId.slice(index + 1);
    gameNameInput.value = gameName;
    tagLineInput.value = tagLine;
    regionInput.value = params.get('region') || 'americas';
    showProfile(gameName, tagLine, regionInput.value, false);
  }
})();
