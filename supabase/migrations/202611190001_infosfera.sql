begin;
create table public.infosfera_issues (
  id text primary key, storage_path text not null unique, extra_paths text[] not null default '{}',
  page_count integer not null check (page_count > 0),
  preview_pages integer not null check (preview_pages > 0 and preview_pages < page_count),
  sha256 text not null, byte_size bigint not null, active boolean not null default true
);
create table public.infosfera_leads (
  id uuid primary key default gen_random_uuid(),
  issue_id text not null references public.infosfera_issues(id),
  first_name text not null check (length(first_name) between 1 and 100),
  email text not null check (length(email) <= 254),
  privacy_consent boolean not null check (privacy_consent),
  privacy_version text not null default '2026-11-19',
  created_at timestamptz not null default now(),
  unique(issue_id,email)
);
create table public.infosfera_sessions (
  token_hash text primary key,
  issue_id text not null references public.infosfera_issues(id),
  expires_at timestamptz not null
);
create index on public.infosfera_sessions(expires_at);
create table public.infosfera_rate_limits (
  key text primary key, hits integer not null default 1,
  expires_at timestamptz not null
);
alter table public.infosfera_issues enable row level security;
alter table public.infosfera_leads enable row level security;
alter table public.infosfera_sessions enable row level security;
alter table public.infosfera_rate_limits enable row level security;
revoke all on public.infosfera_issues, public.infosfera_leads, public.infosfera_sessions, public.infosfera_rate_limits from anon, authenticated;
grant select,insert,update,delete on public.infosfera_issues, public.infosfera_leads, public.infosfera_sessions, public.infosfera_rate_limits to service_role;
grant select on public.infosfera_leads to authenticated;
create policy infosfera_editor_read on public.infosfera_leads for select to authenticated using ((select public.is_cms_editor()));
-- An atomic counter works across serverless instances. Raw IP addresses are never stored.
create function public.infosfera_rate_limit(p_key text, p_limit integer, p_seconds integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  delete from public.infosfera_rate_limits where expires_at < now();
  delete from public.infosfera_sessions where expires_at < now();
  insert into public.infosfera_rate_limits(key,hits,expires_at)
    values(p_key,1,now()+make_interval(secs=>p_seconds))
    on conflict(key) do update set hits=public.infosfera_rate_limits.hits+1 returning hits into n;
  return n <= p_limit;
end;
$$;
revoke all on function public.infosfera_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.infosfera_rate_limit(text,integer,integer) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('infosfera-private','infosfera-private',false,52428800,array['application/pdf','application/octet-stream']);
commit;
