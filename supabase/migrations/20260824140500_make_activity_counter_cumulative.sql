create or replace function private.capture_analysis_activity()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  kst_day date := (clock_timestamp() at time zone 'Asia/Seoul')::date;
  hash_a text := md5(lower(btrim(new.name_a)));
  hash_b text := md5(lower(btrim(new.name_b)));
begin
  insert into public.activity_daily (stat_date, run_count, updated_at)
  values (kst_day, 1, now())
  on conflict (stat_date) do update set run_count = public.activity_daily.run_count + 1, updated_at = now();
  insert into public.name_mention_stats (name_hash, mention_count, updated_at)
  values (hash_a, 1, now())
  on conflict (name_hash) do update set mention_count = public.name_mention_stats.mention_count + 1, updated_at = now();
  insert into public.name_mention_stats (name_hash, mention_count, updated_at)
  values (hash_b, 1, now())
  on conflict (name_hash) do update set mention_count = public.name_mention_stats.mention_count + 1, updated_at = now();
  return new;
end;
$$;

create or replace function public.get_activity_snapshot(input_names text[] default array[]::text[])
returns table(run_count integer, popular_names text[])
language sql stable security invoker set search_path = '' as $$
  select
    greatest(coalesce((select sum(d.run_count) from public.activity_daily d), 78), 78)::integer,
    coalesce((
      select array_agg(candidate.display_name order by candidate.display_name)
      from (
        select distinct btrim(n) as display_name, md5(lower(btrim(n))) as name_hash
        from unnest(input_names[1:2]) as n
        where char_length(btrim(n)) between 1 and 20
      ) candidate
      join public.name_mention_stats s on s.name_hash = candidate.name_hash
    ), array[]::text[]);
$$;

revoke all on function public.get_activity_snapshot(text[]) from public;
grant execute on function public.get_activity_snapshot(text[]) to anon, authenticated;
