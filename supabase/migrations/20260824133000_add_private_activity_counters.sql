create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.activity_daily (
  stat_date date primary key,
  run_count integer not null default 0 check (run_count >= 0),
  updated_at timestamptz not null default now()
);
alter table public.activity_daily enable row level security;
revoke all on public.activity_daily from anon, authenticated;
grant select on public.activity_daily to anon, authenticated;
create policy "public reads activity total" on public.activity_daily for select to anon, authenticated using (true);

create table if not exists public.name_mention_stats (
  name_key text primary key check (char_length(name_key) between 1 and 20),
  display_name text not null check (char_length(display_name) between 1 and 20),
  mention_count integer not null default 0 check (mention_count >= 0),
  updated_at timestamptz not null default now()
);
alter table public.name_mention_stats enable row level security;
revoke all on public.name_mention_stats from anon, authenticated;

insert into public.activity_daily (stat_date, run_count)
values ((now() at time zone 'Asia/Seoul')::date, 78)
on conflict (stat_date) do nothing;

create or replace function private.capture_analysis_activity()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  kst_day date := (clock_timestamp() at time zone 'Asia/Seoul')::date;
  key_a text := lower(btrim(new.name_a));
  key_b text := lower(btrim(new.name_b));
begin
  insert into public.activity_daily (stat_date, run_count, updated_at)
  values (kst_day, 1, now())
  on conflict (stat_date) do update set run_count = public.activity_daily.run_count + 1, updated_at = now();
  insert into public.name_mention_stats (name_key, display_name, mention_count, updated_at)
  values (key_a, btrim(new.name_a), 1, now())
  on conflict (name_key) do update set display_name = excluded.display_name, mention_count = public.name_mention_stats.mention_count + 1, updated_at = now();
  insert into public.name_mention_stats (name_key, display_name, mention_count, updated_at)
  values (key_b, btrim(new.name_b), 1, now())
  on conflict (name_key) do update set display_name = excluded.display_name, mention_count = public.name_mention_stats.mention_count + 1, updated_at = now();
  return new;
end;
$$;
revoke all on function private.capture_analysis_activity() from public, anon, authenticated;
create trigger capture_analysis_activity after insert on public.analysis_submissions
for each row execute function private.capture_analysis_activity();

create or replace function public.get_activity_snapshot(input_names text[] default array[]::text[])
returns table(run_count integer, popular_names text[])
language sql stable security definer set search_path = '' as $$
  select
    coalesce((select d.run_count from public.activity_daily d where d.stat_date = (now() at time zone 'Asia/Seoul')::date), 78)::integer,
    coalesce((
      select array_agg(s.display_name order by s.mention_count desc, s.display_name)
      from public.name_mention_stats s
      where s.name_key in (
        select lower(btrim(n)) from unnest(input_names[1:2]) as n
        where char_length(btrim(n)) between 1 and 20
      ) and s.mention_count >= 3
    ), array[]::text[]);
$$;
revoke all on function public.get_activity_snapshot(text[]) from public;
grant execute on function public.get_activity_snapshot(text[]) to anon, authenticated;
