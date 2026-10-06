// Configuração pública do Supabase.
// A publishable key pode ficar no navegador; nunca use service_role no frontend.
(() => {
  const sdk = window.supabase;
  if (!sdk?.createClient) {
    window.IDEIAS_SUPABASE = { client: null };
    return;
  }
  window.IDEIAS_SUPABASE = {
    client: sdk.createClient(
      'https://bnlvvsjgpywpbfhwdcan.supabase.co',
      'sb_publishable_8q954VgGB7IUEgwWYA55-Q_MUyDd17c',
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
    )
  };
})();
