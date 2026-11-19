# Infosfera: archivio e accesso alla rivista

Implementazione del 19 novembre 2026. Pagina pubblica `/infosfera`, contatti in
`/admin` → **Contatti Infosfera** → **Esporta tutti in CSV** (solo redattori CMS).

## Archivio verificato

| ID interno | Numero | Pagine PDF | Anteprima fino alla pagina |
|---|---|---:|---:|
| 0 | 1/2020 | 62 | 5 |
| 1 | 1/2021 | 78 | 5 |
| 2 | 2/2021 | 84 | 5 |
| 3 | 1/2022 | 68 | 5 |
| 4 | 2/2022 | 96 | 7 |
| 5 | 1/2023 | 76 | 6 |
| 6 | 2/2023 | 96 | 8 |
| 7 | 1/2024 | 76 | 7 |
| 9 | 1/2025 | 78 | 7 |
| 10 | 2/2025 | 100 | 7 |
| 11 | 1/2026 | 88 | 7 |
| 12 | 2/2026, ottobre | 100 | 7 |

Totale: **12 edizioni, 1.002 pagine, 76 pagine di anteprima**. Il limite è
stato verificato sul contenuto dell'editoriale, non fissato a sette pagine per
tutti. Il 2/2022 include l'infografica finale dell'editoriale a pagina 7.
L'eventuale pagina bianca del numero più recente viene saltata nella vista
mobile, mantenuta nel PDF e nella vista doppia desktop.

Fonte: [archivio PRIDE](https://www.edih-pride.eu/magazine/), con controllo
della libreria media WordPress autenticata per il numero 1/2023. La voce
“2/2024” di PRIDE punta allo stesso PDF di febbraio 2025: è stata riconciliata
con il numero 1/2025, senza introdurre una falsa edizione duplicata.
Per 1/2024 si usa la revisione da 76 pagine collegata dall'archivio; la variante
precedente da 78 pagine è conservata nel backup.

## Flusso e protezione

- Le sole anteprime WebP e le copertine sono pubbliche. I PDF completi sono
  nel bucket Supabase **infosfera-private**, privato e senza policy anonime.
- `POST /api/infosfera?issue=ID` valida nome, email, presa visione privacy,
  honeypot e origine; applica un limite di 20 nuove richieste/ora per IP
  pseudonimizzato tramite HMAC. Salva il contatto prima di autorizzare il PDF.
- Il cookie per numero dura 30 giorni ed è `HttpOnly`, `Secure`, `SameSite=Lax`.
  Nel database si salva solo l'hash del token. I link firmati durano un'ora.
  Le risposte API non sono memorizzabili in cache. Nessuna chiave server viene
  inclusa nel frontend.
- Il modulo non attiva iscrizioni a newsletter. Il CSV identifica nome, email,
  edizione e data della richiesta. I contatti sono deduplicati per email/numero.
- PDF.js viene caricato solo dopo lo sblocco, con worker, font e codec locali.
  Supporta cambio pagina, salto diretto, zoom, swipe e testo selezionabile.
- Il 2/2025 supera il limite di 50 MiB per file del piano Free: è archiviato
  in due parti private, ricomposto e verificato con SHA-256 prima dell'uso.
  Il PDF restituito è identico all'originale, senza ricompressione o perdita.
- Gli originali ancora pubblicati su PRIDE restano sotto il controllo di PRIDE.
  La protezione riguarda la nuova copia Campania DIH.

## Configurazione e manutenzione

Applicare `supabase/migrations/202611190001_infosfera.sql` una sola volta.
Impostare su Vercel, lato server, `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `INFOSFERA_RATE_SECRET`; le variabili `VITE_`
contengono soltanto URL e chiave pubblica Supabase. Il `.env` locale è ignorato
da Git e contiene le credenziali operative; non copiarlo in documenti o email.

Il backup locale esterno al repository è
`/home/aedjoel/SMDev/DIH/infosfera-backup-2026-11-19/`: originali,
`import-manifest.json` con hash/dimensioni/metadati, parti in `upload/`,
risultati di verifica upload e download, strumenti di estrazione/rendering.

Per aggiungere un numero:

1. Conservare l'originale nel backup; verificare numero, pagine, fine
   editoriale e SHA-256. Non mettere PDF completi sotto `public/`.
2. Caricare il PDF in `infosfera-private` con un nome contenente l'hash.
   Se supera 50 MiB, suddividerlo in parti da 32 MiB; mantenere ordine e
   hash dell'intero originale. Scaricare e confrontare byte per byte dopo
   l'upload, quindi inserire la riga in `infosfera_issues`.
3. Renderizzare solo le pagine autorizzate (WebP, larghezza 1600, qualità 90)
   sotto `public/assets/infosfera/numeri/ID/anteprima/`.
4. Aggiornare `infosferaManifest.json` e `infosferaData.ts` con metadati,
   copertina e testo. Nessun URL al PDF completo deve entrare nel bundle.
5. Eseguire test, lint, typecheck, build e prova su preview: utente anonimo,
   modulo, sblocco, lettura mobile/desktop, download, contatto in redazione.
   Rimuovere esclusivamente i dati sintetici creati dal collaudo.

`npm run prebuild` e `predev` copiano gli asset PDF.js dalla dipendenza
installata. `npm run dev` serve il frontend; per l'API utilizzare Vercel Dev
con le variabili server oppure un deployment preview protetto.

Non ripristinare per errore un vecchio build con PDF completi pubblici.
In caso di indisponibilità, la API fallisce chiusa; non rendere pubblico il
bucket per ripristinare il servizio. I file storici e il database articoli
sono separati e non vengono modificati da questo intervento.
