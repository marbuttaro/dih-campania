import { cp, mkdir } from 'node:fs/promises'
// Decoder binaries and bundled fonts match the installed, lockfile-pinned PDF.js.
for (const folder of ['wasm','standard_fonts','cmaps','iccs']) {
  await mkdir(`public/assets/pdfjs/${folder}`,{recursive:true})
  await cp(`node_modules/pdfjs-dist/${folder}`,`public/assets/pdfjs/${folder}`,{recursive:true})
}
await cp('node_modules/pdfjs-dist/LICENSE','public/assets/pdfjs/LICENSE')
