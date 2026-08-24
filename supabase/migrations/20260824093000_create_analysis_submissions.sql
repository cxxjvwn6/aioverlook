create table if not exists public.analysis_submissions (
  id uuid primary key default gen_random_uuid(), name_a text not null check (char_length(name_a) between 1 and 20),
  gender_a text not null check (gender_a in ('male','female','unspecified')), name_b text not null check (char_length(name_b) between 1 and 20),
  gender_b text not null check (gender_b in ('male','female','unspecified')), overall_score smallint not null check (overall_score between 0 and 100),
  analysis_result jsonb not null, created_at timestamptz not null default now()
);
alter table public.analysis_submissions enable row level security;
revoke all on public.analysis_submissions from anon, authenticated;
grant insert on public.analysis_submissions to anon, authenticated;
grant select on public.analysis_submissions to authenticated;
create policy "anonymous submissions only" on public.analysis_submissions for insert to anon, authenticated with check (true);
create policy "admins read submissions" on public.analysis_submissions for select to authenticated using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');
create index if not exists analysis_submissions_created_at_idx on public.analysis_submissions (created_at desc);
create index if not exists analysis_submissions_names_idx on public.analysis_submissions (lower(name_a), lower(name_b));
