-- Catálogos públicos devem ser somente leitura para clientes.
-- Escritas devem ocorrer por backend/moderação com privilégio apropriado.

revoke insert, update, delete on public.montapc_components from authenticated;
revoke insert, update, delete on public.gameradar_games from authenticated;
revoke insert, update, delete on public.gameradar_offers from authenticated;
revoke insert, update, delete on public.revisa_questions from authenticated;

grant select on public.montapc_components to anon, authenticated;
grant select on public.gameradar_games to anon, authenticated;
grant select on public.gameradar_offers to anon, authenticated;
grant select on public.revisa_questions to anon, authenticated;
