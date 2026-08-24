create or replace function private.capture_analysis_activity()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  kst_day date := (clock_timestamp() at time zone 'Asia/Seoul')::date;
  hash_a text := md5(lower(btrim(new.name_a)));
  hash_b text := md5(lower(btrim(new.name_b)));
begin
  insert into public.activity_daily (stat_date, run_count, updated_at)
  values (kst_day, 79, now())
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
