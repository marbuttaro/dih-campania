const NAV_COLUMNS = [
  {
    title: 'Navigazione',
    links: [
      { href: '#servizi', label: 'Servizi' },
      { href: '#progetti', label: 'Progetti' },
      { href: '/eventi', label: 'Eventi' },
      { href: '/news?categoria=bandi', label: 'Bandi' },
      { href: '/news', label: 'News e archivio' },
      { href: '/chi-siamo', label: 'Chi Siamo' },
    ],
  },
  {
    title: 'Risorse',
    links: [
      { href: '#', label: 'Newsletter' },
      { href: '#', label: 'Infosfera' },
      { href: '#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Contatti',
    links: [
      { href: '#contatti', label: 'Contattaci' },
      { href: '#', label: 'DIH Campania' },
      { href: '/trasparenza', label: 'Trasparenza' },
    ],
  },
]

// Brand marks drawn inline: lucide no longer ships logo icons
const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/CampaniaDigital/',
    label: 'Facebook',
    path: 'M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-4.2v-7h2.4l.4-2.9h-2.8V10.3c0-.8.3-1.4 1.4-1.4h1.5V6.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7v2.2H9.4V15h2.5v7H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z',
  },
  {
    href: 'https://it.linkedin.com/company/campaniadih',
    label: 'LinkedIn',
    path: 'M5 2h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zm1.6 7.6V18h2.7V9.6H6.6zM8 5.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zm3.3 4.2V18H14v-4.4c0-1.2.4-2.1 1.6-2.1 1.1 0 1.4.9 1.4 2.1V18h2.7v-4.9c0-2.5-1.1-3.7-3.2-3.7-1.3 0-2.1.6-2.5 1.3V9.6h-2.7z',
  },
  {
    href: 'https://x.com/CampaniaDih',
    label: 'X',
    path: 'M17.8 2.5h3.1l-6.8 7.8 8 10.6h-6.3l-4.9-6.4-5.6 6.4H2.2l7.3-8.3L1.8 2.5h6.4l4.4 5.9 5.2-5.9zm-1.1 16.5h1.7L7.4 4.3H5.5L16.7 19z',
  },
]

export function Footer() {
  const path = window.location.pathname
  const isHome = path === '/' || path.endsWith('index.html') || path === ''

  const getLinkHref = (href: string) => {
    if (href.startsWith('/') || href === '#') return href
    return isHome ? href : `/${href}`
  }

  return (
    <footer data-no-glow className="bg-brand-dark-navy text-white pt-20 pb-10">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-10 lg:gap-16 mb-16">
          <div>
            <img
              src="/assets/logo DIH.svg"
              alt="Campania DIH"
              className="h-14 sm:h-[50px] mb-5"
            />
            <p className="text-white/60 text-sm mb-4 leading-relaxed">
              Campania Digital Innovation Hub
              <br />
              Rete Confindustria
            </p>
            <address className="not-italic text-white/60 text-sm mb-4 leading-relaxed">
              Piazza dei Martiri, 58
              <br />
              80121 Napoli
            </address>
            <p className="text-brand-light-blue text-sm mb-2">info@campaniadih.it</p>
            <p className="text-white/40 text-xs">P.IVA 08145861215 - SDI</p>
          </div>

          {NAV_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-white text-[15px] font-semibold mb-5">{column.title}</h4>
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {column.links.map((link) => (
                  <li key={link.label} className={link.label === 'Trasparenza' ? 'mt-4' : undefined}>
                    <a
                      href={getLinkHref(link.href)}
                      className="text-white/60 text-sm hover:text-brand-light-blue transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-white text-[15px] font-semibold mb-5">Seguici sui social:</h4>
            <ul className="flex items-center gap-4 list-none p-0 m-0">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Campania DIH su ${social.label}`}
                    className="block text-[#8EBEF7] hover:text-white transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-8">
                      <path fillRule="evenodd" d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-7 text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} Campania DIH. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}
