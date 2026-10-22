begin;

create table public.cms_editors (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.cms_editors enable row level security;
revoke all on public.cms_editors from anon, authenticated;
grant select on public.cms_editors to authenticated;
create policy editor_self on public.cms_editors for select to authenticated using (user_id = (select auth.uid()));

create function public.is_cms_editor() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.cms_editors where user_id = (select auth.uid()));
$$;
revoke all on function public.is_cms_editor() from public;
grant execute on function public.is_cms_editor() to anon, authenticated;

create table public.categories (
  slug text primary key check (length(slug) between 1 and 220 and slug !~ '[/?#[:space:]]'),
  name text not null check (length(trim(name)) > 0),
  wp_id bigint unique,
  parent_slug text references public.categories(slug)
);
alter table public.categories enable row level security;
grant select on public.categories to anon, authenticated;
grant insert, update on public.categories to authenticated;
create policy categories_read on public.categories for select to anon, authenticated using (true);
create policy categories_insert on public.categories for insert to authenticated with check ((select public.is_cms_editor()));
create policy categories_update on public.categories for update to authenticated using ((select public.is_cms_editor())) with check ((select public.is_cms_editor()));

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  wp_id bigint unique,
  slug text not null unique check (length(slug) between 1 and 220 and slug !~ '[/?#[:space:]]'),
  title text not null,
  excerpt text not null default '',
  content_html text not null default '',
  featured_image text not null default '',
  featured_image_alt text not null default '',
  author_name text not null default 'Campania DIH',
  category_slugs text[] not null default '{}',
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published','private')),
  constraint articles_title_required check (wp_id is not null or status = 'draft' or length(trim(title)) > 0),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  original_url text,
  is_featured boolean not null default false,
  event_at timestamptz,
  event_location text not null default '',
  seo_description text not null default '',
  search_document tsvector generated always as (
    setweight(to_tsvector('italian', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('italian', coalesce(excerpt,'')), 'B') ||
    setweight(to_tsvector('italian', regexp_replace(coalesce(content_html,''), '<[^>]*>', ' ', 'g')), 'C')
  ) stored
);
create index articles_search_idx on public.articles using gin(search_document);
create index articles_categories_idx on public.articles using gin(category_slugs);
create index articles_published_idx on public.articles(published_at desc, id) where deleted_at is null and status = 'published';
alter table public.articles enable row level security;
revoke all on public.articles from anon, authenticated;
grant select on public.articles to anon, authenticated;
grant insert, update on public.articles to authenticated;
create policy articles_public on public.articles for select to anon, authenticated
  using (status = 'published' and published_at <= now() and deleted_at is null);
create policy articles_editor_read on public.articles for select to authenticated using ((select public.is_cms_editor()));
create policy articles_editor_insert on public.articles for insert to authenticated with check ((select public.is_cms_editor()));
create policy articles_editor_update on public.articles for update to authenticated
  using ((select public.is_cms_editor())) with check ((select public.is_cms_editor()));
-- No client DELETE permission: deleting an article is a reversible trash operation.

create table public.article_sources (
  article_id uuid primary key references public.articles(id) on delete cascade,
  source jsonb not null,
  imported_at timestamptz not null default now()
);
alter table public.article_sources enable row level security;
revoke all on public.article_sources from anon, authenticated;
grant select on public.article_sources to authenticated;
create policy sources_editor_read on public.article_sources for select to authenticated using ((select public.is_cms_editor()));

create table public.article_revisions (
  id bigint generated always as identity primary key,
  article_id uuid not null references public.articles(id),
  snapshot jsonb not null,
  changed_at timestamptz not null default now(),
  changed_by uuid
);
alter table public.article_revisions enable row level security;
revoke all on public.article_revisions from anon, authenticated;
grant select on public.article_revisions to authenticated;
create policy revisions_editor_read on public.article_revisions for select to authenticated using ((select public.is_cms_editor()));

create table public.article_aliases (
  slug text primary key,
  article_id uuid not null references public.articles(id) on delete cascade
);
alter table public.article_aliases enable row level security;
revoke all on public.article_aliases from anon, authenticated;
grant select on public.article_aliases to anon, authenticated;
create policy aliases_read on public.article_aliases for select to anon, authenticated
  using (exists(select 1 from public.articles a where a.id = article_id));

create function public.validate_article() returns trigger language plpgsql set search_path = '' as $$
begin
  if exists(select 1 from public.article_aliases where slug = new.slug and article_id <> new.id) then
    raise exception 'Questo indirizzo appartiene allo storico di un altro articolo';
  end if;
  if exists (select 1 from unnest(new.category_slugs) s where not exists (select 1 from public.categories c where c.slug = s)) then
    raise exception 'Categoria non esistente';
  end if;
  if tg_op = 'UPDATE' then new.updated_at = clock_timestamp(); end if;
  return new;
end;
$$;
create trigger articles_validate before insert or update on public.articles for each row execute function public.validate_article();

create function public.record_article_revision() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.article_revisions(article_id, snapshot, changed_by) values (old.id, to_jsonb(old) - 'search_document', auth.uid());
  if old.slug <> new.slug then
    insert into public.article_aliases(slug, article_id) values (old.slug, old.id) on conflict (slug) do nothing;
  end if;
  return new;
end;
$$;
create trigger articles_revision after update on public.articles for each row execute function public.record_article_revision();

create function public.article_years() returns table(year integer) language sql stable security invoker set search_path = '' as $$
  select distinct extract(year from published_at at time zone 'Europe/Rome')::integer
  from public.articles where status = 'published' and published_at <= now() and deleted_at is null order by 1 desc;
$$;
revoke all on function public.article_years() from public;
grant execute on function public.article_years() to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('article-media', 'article-media', true, 52428800, array['image/jpeg','image/png','image/webp','image/gif','image/avif','application/pdf','video/mp4','audio/mpeg','application/msword','text/plain','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation'])
on conflict (id) do nothing;
create policy article_media_read on storage.objects for select to anon, authenticated using (bucket_id = 'article-media');
create policy article_media_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'article-media' and (select public.is_cms_editor()));
-- Uploads receive unique paths; existing assets cannot be overwritten or removed by browser clients.
commit;
