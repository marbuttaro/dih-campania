begin;
-- Projects with automatic API grants disabled need explicit server permissions.
-- These grants never reach the browser: service_role is used only by trusted tools.
grant usage on schema public to service_role;
grant select, insert, update, delete on
  public.cms_editors, public.categories, public.articles,
  public.article_sources, public.article_revisions, public.article_aliases
to service_role;
grant usage, select on sequence public.article_revisions_id_seq to service_role;
grant execute on function public.is_cms_editor(), public.article_years() to service_role;
commit;
