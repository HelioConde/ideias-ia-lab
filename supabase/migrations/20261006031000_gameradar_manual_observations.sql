-- GameRadar: permite registrar preço observado manualmente sem fingir monitoramento automático.

alter table public.gameradar_custom_alerts
  add column if not exists last_seen_price_cents integer,
  add column if not exists last_seen_store text,
  add column if not exists last_seen_at timestamptz,
  add column if not exists store_url text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname='gameradar_custom_alerts_last_seen_price_check'
      and conrelid='public.gameradar_custom_alerts'::regclass
  ) then
    alter table public.gameradar_custom_alerts
      add constraint gameradar_custom_alerts_last_seen_price_check
      check (last_seen_price_cents is null or last_seen_price_cents >= 0);
  end if;
end $$;

create index if not exists gameradar_custom_alerts_user_target_idx
  on public.gameradar_custom_alerts(user_id, target_price_cents, updated_at desc);

grant select, insert, update, delete on public.gameradar_custom_alerts to authenticated;
