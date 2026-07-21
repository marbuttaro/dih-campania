import { useState, useEffect } from 'react'

const NAV_COLUMNS = [
  {
    title: 'Navigazione',
    links: [
      { href: '#servizi', label: 'Servizi' },
      { href: '#progetti', label: 'Progetti' },
      { href: '#bandi', label: 'Bandi' },
      { href: '/chi-siamo.html', label: 'Chi Siamo' },
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
    ],
  },
]

export function Footer() {
  const [isHome, setIsHome] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      setIsHome(path === '/' || path.endsWith('index.html') || path === '')
    }
  }, [])

  const getLinkHref = (href: string) => {
    if (href.startsWith('/') || href === '#') return href
    return isHome ? href : `/${href}`
  }

  return (
    <footer data-no-glow className="bg-brand-dark-navy text-white pt-20 pb-10">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-16 mb-16">
          <div>
            <img
              src="/assets/logo DIH.svg"
              alt="Campania DIH"
              className="h-[50px] mb-5 brightness-[10]"
            />
            <p className="text-white/60 text-sm mb-4 leading-relaxed">
              Campania Digital Innovation Hub
              <br />
              Rete Confindustria
            </p>
            <p className="text-brand-light-blue text-sm mb-2">info@campaniadih.it</p>
            <p className="text-white/40 text-xs">P.IVA 08145861215 - SDI</p>
          </div>

          {NAV_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="text-white text-[15px] font-semibold mb-5">{column.title}</h4>
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {column.links.map((link) => (
                  <li key={link.label}>
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
