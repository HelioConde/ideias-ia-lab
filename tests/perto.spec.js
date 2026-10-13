const { test, expect } = require('@playwright/test');

const activeProfile = {
  id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  user_id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  display_name: 'Ana Eletricista',
  city: 'Brasília', state: 'DF', category: 'Eletricista',
  description: 'Instalação de tomadas e manutenção residencial.',
  price_from_cents: 8000, rating: null, status: 'active'
};
const pendingProfile = {
  ...activeProfile, id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  display_name: 'Perfil ainda pendente', status: 'pending'
};

async function installMock(page, { user = null, profiles = [activeProfile, pendingProfile] } = {}) {
  await page.route('https://cdn.jsdelivr.net/**', route => route.abort());
  await page.addInitScript(({ user, profiles }) => {
    const state = { user, profiles, requests: [], inserted: [], errors: [] };
    window.__pertoTest = state;
    function query(table) {
      const opts = { mode: 'read', filters: [], limit: 100 };
      const chain = {
        select(_columns, settings = {}) { opts.head = settings.head || false; return chain; },
        eq(column, value) { opts.filters.push(p => p[column] === value); return chain; },
        ilike(column, term) {
          const needle = String(term).replace(/^%|%$/g, '').toLocaleLowerCase('pt-BR');
          opts.filters.push(p => String(p[column] || '').toLocaleLowerCase('pt-BR').includes(needle));
          return chain;
        },
        order() { return chain; },
        limit(value) { opts.limit = value; return chain; },
        insert(data) { opts.mode = 'insert'; opts.payload = data; return chain; },
        update(data) { opts.mode = 'update'; opts.payload = data; return chain; },
        run() {
          if (opts.mode === 'insert') {
            state.inserted.push({ table, payload: opts.payload });
            const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...opts.payload, status: opts.payload.status || 'new' };
            if (table === 'perto_requests') state.requests.push(row);
            if (table === 'perto_professionals') state.profiles.push(row);
            return { data: row, error: null };
          }
          if (opts.mode === 'update') {
            const collection = table === 'perto_requests' ? state.requests : state.profiles;
            const row = collection.filter(p => opts.filters.every(f => f(p)))[0];
            if (!row) return { data: null, error: { message: 'No matching row' } };
            Object.assign(row, opts.payload);
            return { data: row, error: null };
          }
          const source = table === 'perto_requests' ? state.requests : state.profiles;
          const rows = source.filter(p => opts.filters.every(f => f(p))).slice(0, opts.limit);
          return { data: opts.head ? null : rows, error: null, count: rows.length };
        },
        maybeSingle() { const out = chain.run(); return Promise.resolve({ ...out, data: out.data?.[0] || null }); },
        single() { return Promise.resolve(chain.run()); },
        then(resolve, reject) { return Promise.resolve(chain.run()).then(resolve, reject); }
      };
      return chain;
    }
    const client = {
      from: query,
      auth: {
        getSession: async () => ({ data: { session: state.user ? { user: state.user } : null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
        signInWithPassword: async () => ({ error: { message: 'Not a real account' } }),
        signUp: async () => ({ data: { session: null }, error: null }),
        resetPasswordForEmail: async () => ({ error: null }),
        signOut: async () => { state.user = null; return { error: null }; }
      }
    };
    window.supabase = { createClient: () => client };
  }, { user, profiles });
}

test('filters public active profiles and does not show pending profiles', async ({ page }) => {
  await installMock(page);
  await page.goto('/');
  await page.locator('#city').fill('Brasília');
  await page.locator('#state').selectOption('DF');
  await page.locator('#category').selectOption('Eletricista');
  await page.locator('#search-button').click();
  await expect(page.locator('.professional-card')).toHaveCount(1);
  await expect(page.locator('.professional-card')).toContainText('Ana Eletricista');
  await expect(page.locator('#results')).not.toContainText('Perfil ainda pendente');
  await page.locator('[data-request]').click();
  await expect(page.locator('#account-dialog')).toBeVisible();
  await expect(page.locator('#account-message')).toContainText('Entre ou crie uma conta');
});

test('authenticated customer can send a private request with no client-selected status', async ({ page }) => {
  await installMock(page, { user: { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', email: 'cliente@example.test' } });
  await page.goto('/');
  await expect(page.locator('#sync-status')).toContainText('Conectado');
  await page.locator('#search-button').click();
  await page.locator('[data-request]').first().click();
  await expect(page.locator('#request-dialog')).toBeVisible();
  await page.locator('[name="contact"]').fill('cliente@example.test');
  await page.locator('[name="message"]').fill('Preciso instalar tomadas na cozinha.');
  await page.locator('#request-form [type="submit"]').click();
  await expect(page.locator('#request-dialog')).not.toBeVisible();
  await expect(page.locator('#request-list')).toContainText('Preciso instalar tomadas');
  const submitted = await page.evaluate(() => window.__pertoTest.inserted.find(x => x.table === 'perto_requests'));
  expect(submitted.payload.user_id).toBe('dddddddd-dddd-4ddd-8ddd-dddddddddddd');
  expect(submitted.payload.professional_id).toBe('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
  expect(submitted.payload).not.toHaveProperty('status');
  await expect(page.locator('#request-list')).not.toContainText('cliente@example.test');
});

test('empty public catalog stays honest, no fictitious professionals', async ({ page }) => {
  await installMock(page, { profiles: [] });
  await page.goto('/');
  await expect(page.locator('#hero-count')).toHaveText('0');
  await page.locator('#search-button').click();
  await expect(page.locator('#results')).toContainText('Nenhum profissional ativo encontrado');
  await expect(page.locator('.professional-card')).toHaveCount(0);
});
