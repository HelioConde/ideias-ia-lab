(() => {
  const existing = window.RIOT_LEGACY_BACKEND || {};
  window.RIOT_LEGACY_BACKEND = Object.freeze({
    endpoint: typeof existing.endpoint === 'string' ? existing.endpoint : ''
  });
})();
