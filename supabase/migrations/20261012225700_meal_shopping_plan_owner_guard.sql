-- PratoPronto: every meal and shopping item must belong to a plan owned
-- by the same authenticated user. Restrictive policies compose with owner_all.
create policy pratopronto_meals_plan_owner_guard
on public.pratopronto_meals
as restrictive
for all
to authenticated
using (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.pratopronto_plans plan
    where plan.id = pratopronto_meals.plan_id
      and plan.user_id = (select auth.uid())
  )
)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.pratopronto_plans plan
    where plan.id = pratopronto_meals.plan_id
      and plan.user_id = (select auth.uid())
  )
);

create policy pratopronto_shopping_plan_owner_guard
on public.pratopronto_shopping_items
as restrictive
for all
to authenticated
using (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.pratopronto_plans plan
    where plan.id = pratopronto_shopping_items.plan_id
      and plan.user_id = (select auth.uid())
  )
)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.pratopronto_plans plan
    where plan.id = pratopronto_shopping_items.plan_id
      and plan.user_id = (select auth.uid())
  )
);
