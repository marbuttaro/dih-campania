import { useEffect, useState, type MouseEvent } from 'react'
import { MenuIcon, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ContactModal } from './ContactModal'

const SERVIZI_SUBLINKS = [
  { href: '/trasformazione-digitale', label: 'Trasformazione Digitale' },
  { href: '/cybersecurity', label: 'Cybersecurity' },
  { href: '/intelligenza-artificiale', label: 'Intelligenza Artificiale' },
] as const

const NAV_LINKS = [
  { href: '/servizi', label: 'Servizi', children: SERVIZI_SUBLINKS },
  { href: '/progetti', label: 'Progetti' },
  // Bandi, Newsletter e Infosfera temporaneamente nascosti su richiesta
  // { href: '#bandi', label: 'Bandi' },
  // { href: '#newsletter', label: 'Newsletter' },
  // { href: '#infosfera', label: 'Infosfera' },
  { href: '/innova-co', label: 'Innova.Co' },
  { href: '/chi-siamo', label: 'Chi Siamo' },
] as const

function scrollToContact(e: MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('contatti')
  if (!target) return

  e.preventDefault()
  const offset = 112 // matches scroll-mt-28 used on the contact sections
  const startY = window.scrollY
  const targetY = target.getBoundingClientRect().top + startY - offset
  const distance = targetY - startY
  const duration = 450
  const startTime = performance.now()

  const step = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration)
    const eased = 1 - Math.pow(1 - t, 3)
    window.scrollTo(0, startY + distance * eased)
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [isHome, setIsHome] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    if (typeof window !== 'undefined') {
      const path = window.location.pathname
      setIsHome(path === '/' || path.endsWith('index.html') || path === '')
    }

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const getLinkHref = (href: string) => {
    if (href.startsWith('/')) return href
    return isHome ? href : `/${href}`
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 flex justify-center px-4 sm:px-6 transition-all duration-400',
        scrolled ? 'py-2.5' : 'py-5',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between w-full max-w-[1280px] rounded-[21px] transition-all duration-400 pl-10 pr-10 sm:pl-8 sm:pr-8 lg:pl-8 lg:pr-6 py-2.5',
          scrolled
            ? 'bg-brand-dark-navy/60 backdrop-blur-[15px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
            : 'bg-[linear-gradient(90deg,#001933_0%,#002D5C_100%)] shadow-[0_10px_30px_rgba(0,0,0,0.15)]',
        )}
      >
        <a href="/" className="flex items-center shrink-0">
          <img src="/assets/logo-dih-icon.png" alt="Campania DIH" className="h-9 lg:hidden block" />
          <img src="/assets/logo DIH.svg" alt="Campania DIH" className="h-10 hidden lg:block" />
        </a>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) =>
            'children' in link && link.children ? (
              <div key={link.href} className="relative group py-2 -my-2">
                <a
                  href={getLinkHref(link.href)}
                  className="flex items-center gap-1 text-[15px] font-normal text-[#E3EAEC] hover:text-white transition-colors"
                >
                  {link.label}
                  <ChevronDown className="size-4 transition-transform duration-200 group-hover:rotate-180" />
                </a>
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                  <div className="min-w-[240px] rounded-xl bg-brand-dark-navy/95 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] py-2">
                    {link.children.map((child) => (
                      <a
                        key={child.href}
                        href={getLinkHref(child.href)}
                        className="block px-4 py-2.5 text-sm text-[#E3EAEC] hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={getLinkHref(link.href)}
                className="text-[15px] font-normal text-[#E3EAEC] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ),
          )}
        </div>

        <div className="hidden lg:flex">
          <Button
            asChild
            className="bg-[#8EBEF7] text-[#013167] hover:bg-white hover:translate-y-0 px-6 rounded-xl font-bold"
          >
            <a href="#contatti" onClick={scrollToContact}>Contattaci</a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="lg:hidden -mr-3 inline-flex items-center justify-center size-10 text-white hover:text-white/80 transition-colors"
              aria-label="Apri menu"
            >
              <MenuIcon className="size-7" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] sm:w-80">
            <SheetHeader>
              <SheetTitle>
                <img
                  src="/assets/logo DIH.svg"
                  alt="Campania DIH"
                  className="h-10"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <div key={link.href}>
                  <SheetClose asChild>
                    <a
                      href={getLinkHref(link.href)}
                      className="block px-3 py-3 rounded-md text-base text-white/90 hover:bg-white/10 transition-colors"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                  {'children' in link && link.children && (
                    <div className="flex flex-col gap-0.5 pl-6 mb-1">
                      {link.children.map((child) => (
                        <SheetClose asChild key={child.href}>
                          <a
                            href={getLinkHref(child.href)}
                            className="block px-3 py-2 rounded-md text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {child.label}
                          </a>
                        </SheetClose>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <SheetClose asChild>
              <Button
                asChild
                className="mt-6 w-full bg-[#8EBEF7] text-[#013167] hover:bg-white font-bold"
              >
                <button type="button" onClick={() => setContactModalOpen(true)}>
                  Contattaci
                </button>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>

      <ContactModal open={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </nav>
  )
}
