begin;

create table public.bandi (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9-]{0,119}$'),
  scheda jsonb not null check (jsonb_typeof(scheda) = 'object'
    and scheda ?& array['titolo','ente','livello','modalita','abstract','ambiti','destinatari']
    and not (scheda ? 'id')
    and length(trim(scheda->>'titolo')) between 1 and 500
    and length(trim(scheda->>'ente')) between 1 and 300
    and scheda->>'livello' in ('Regionale','Nazionale','Europeo','Internazionale')
    and scheda->>'modalita' in ('scadenza','sportello','ricorrente','informativa','non-documentata','sospesa')
    and jsonb_typeof(scheda->'abstract') = 'array'
    and jsonb_typeof(scheda->'ambiti') = 'array'
    and jsonb_typeof(scheda->'destinatari') = 'array'),
  published boolean not null default false,
  deleted_at timestamptz,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);
create function public.bando_before_update() returns trigger language plpgsql set search_path = '' as $$
begin
  new.version := old.version + 1;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
create trigger bando_version before update on public.bandi for each row execute function public.bando_before_update();
alter table public.bandi enable row level security;
revoke all on public.bandi from public, anon, authenticated;
grant select on public.bandi to anon, authenticated;
grant insert (id, scheda, published), update (scheda, published, deleted_at), delete on public.bandi to authenticated;
grant all on public.bandi to service_role;
create policy bandi_public on public.bandi for select to anon, authenticated using (published and deleted_at is null);
create policy bandi_editor on public.bandi for select to authenticated using ((select public.is_cms_editor()));
create policy bandi_create on public.bandi for insert to authenticated with check ((select public.is_cms_editor()));
create policy bandi_edit on public.bandi for update to authenticated using ((select public.is_cms_editor())) with check ((select public.is_cms_editor()));
create policy bandi_purge on public.bandi for delete to authenticated using (deleted_at is not null and (select public.is_cms_editor()));

-- The snapshot keeps the context of a consultation even after its card is renamed or deleted.
create table public.bando_consulenze (
  id uuid primary key,
  bando_id text not null,
  titolo text not null,
  nome text not null check (length(nome) between 1 and 120),
  email text not null check (length(email) between 3 and 254),
  messaggio text not null check (length(messaggio) between 1 and 3000),
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  lease_until timestamptz
);
alter table public.bando_consulenze enable row level security;
revoke all on public.bando_consulenze from public, anon, authenticated;
grant all on public.bando_consulenze to service_role;
grant select on public.bando_consulenze to authenticated;
create policy consulenze_editor on public.bando_consulenze for select to authenticated using ((select public.is_cms_editor()));
create index consulenze_pending on public.bando_consulenze(created_at) where sent_at is null;
notify pgrst, 'reload schema';
commit;
