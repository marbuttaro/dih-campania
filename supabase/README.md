# Campania DIH editorial database

The public site reads only due, published, untrashed articles. `/admin` requires a
Supabase Auth session and membership in `public.cms_editors`. Signup alone never
grants editorial access. Only a trusted server/service-role client can add editors.
Never place a service-role key in a `VITE_` variable or the repository.

## Deployment sequence

1. Create the dedicated free Supabase organization and European-region project.
2. Apply `migrations/202610220001_articles.sql` through the SQL editor or trusted
   database connection. The migration is transactional and creates RLS policies,
   immutable revision snapshots, search indexes and the media bucket.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in local development and
   Vercel Preview/Production. Keep `SUPABASE_SERVICE_ROLE_KEY` in a separate,
   ignored server-only environment file used only for migration/provisioning.
4. Disable public Auth signup. Set the actual deployment URL as the Auth site URL.
5. Run the data preparation, validation and import commands below. Review the
   source-asset defect report before a production domain change.
6. Use `scripts/provision-editor.mjs` with the dedicated email address and a new
   strong password. For existing users it preserves their current password.
7. Verify the deployed site using both an anonymous session and the editor account:
   search, category/year filters, pagination, legacy URLs, rich content, upload,
   create, edit, backdate, schedule, trash, restore and sign out. Confirm drafts,
   private/future/trashed content and source metadata remain inaccessible publicly.
8. Only then merge/deploy the production branch. Preserve the WordPress backup and
   media originals outside Git. An application rollback can use the prior Vercel
   deployment; imported data remains intact.

## Migration commands

The private backup directory must contain the official WordPress WXR export
(`wordpress.xml`) and a complete public REST export (`posts.json`).

```sh
python3 scripts/prepare-wordpress.py /private/backup
npx tsx --tsconfig tsconfig.app.json scripts/seed-current-news.tsx /private/backup
python3 scripts/audit-media.py /private/backup --download
node scripts/validate-backup.mjs /private/backup
node scripts/import-wordpress.mjs /private/backup
node --env-file=.env.migration scripts/import-wordpress.mjs /private/backup --apply
node --env-file=.env.migration scripts/provision-editor.mjs
node --env-file=.env.migration scripts/verify-hosted.mjs /private/backup
```

The importer validates uniqueness, preserves original IDs/statuses/UTC timestamps,
retains raw source metadata privately, and uploads files under immutable names.
Every uploaded object is downloaded and checked against its SHA-256. It then
compares every imported editorial field against Supabase. Re-running resumes file
uploads and inserts missing articles, but refuses to overwrite editorial changes.
Unavailable source files remain documented; no replacement image is invented.

Original WordPress timestamps retain their GMT instant, including seconds. The
three articles authored directly in the newer site specified only the date
19 October 2026; the seed records a documented normalized publication time.
Dates in the editor use Europe/Rome with an explicit UTC option. Invalid or
ambiguous newly entered DST times require correction; untouched original instants
are preserved even inside the repeated autumn hour.

`npm test` checks PostgreSQL policies and revision behavior with PGlite, HTML
sanitization, exact date conversion and editor persistence contracts. The private
`local-import-verification.json` reports a full field-by-field import rehearsal.
These local checks do not replace the final tests against the hosted project.

The hosted verification script exercises real Auth sessions, anonymous and ordinary
user access, editor CRUD, stale updates, historical slugs, exact dates, private and
scheduled visibility, trash/restore and Storage permissions. It creates isolated
fixtures with random UUIDs and removes only those fixtures in a final cleanup step.
Its private `hosted-verification.json` must pass before production deployment.
