import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const CLEAN_URL_ROUTES: Record<string, string> = {
  '/chi-siamo': '/chi-siamo.html',
  '/cybersecurity': '/cybersecurity.html',
  '/intelligenza-artificiale': '/intelligenza-artificiale.html',
  '/trasformazione-digitale': '/trasformazione-digitale.html',
  '/innova-co': '/innova-co.html',
  '/progetti': '/progetti.html',
  '/servizi': '/servizi.html',
  '/trasparenza': '/trasparenza.html',
  '/eventi': '/eventi.html',
  '/news/investimenti-sostenibili-4-0': '/news/investimenti-sostenibili-4-0.html',
  '/news/sviluppo-competenze-specialistiche': '/news/sviluppo-competenze-specialistiche.html',
  '/news/voucher-cloud-cybersecurity': '/news/voucher-cloud-cybersecurity.html',
}

function cleanUrlsDev(): Plugin {
  return {
    name: 'clean-urls-dev',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const [pathname, search] = req.url.split('?')
          const target = CLEAN_URL_ROUTES[pathname]
          if (target) {
            req.url = search ? `${target}?${search}` : target
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cleanUrlsDev()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        trasformazione: path.resolve(__dirname, 'trasformazione-digitale.html'),
        cybersecurity: path.resolve(__dirname, 'cybersecurity.html'),
        intelligenzaArtificiale: path.resolve(__dirname, 'intelligenza-artificiale.html'),
        chisiamo: path.resolve(__dirname, 'chi-siamo.html'),
        innovaco: path.resolve(__dirname, 'innova-co.html'),
        progetti: path.resolve(__dirname, 'progetti.html'),
        servizi: path.resolve(__dirname, 'servizi.html'),
        trasparenza: path.resolve(__dirname, 'trasparenza.html'),
        eventi: path.resolve(__dirname, 'eventi.html'),
        newsInvestimentiSostenibili: path.resolve(__dirname, 'news/investimenti-sostenibili-4-0.html'),
        newsSviluppoCompetenze: path.resolve(__dirname, 'news/sviluppo-competenze-specialistiche.html'),
        newsVoucherCloud: path.resolve(__dirname, 'news/voucher-cloud-cybersecurity.html'),
      },
    },
  },
})
