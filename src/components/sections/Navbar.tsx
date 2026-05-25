import { useEffect, useState } from 'react'
import { MenuIcon } from 'lucide-react'

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

const NAV_LINKS = [
  { href: '#servizi', label: 'Servizi' },
  { href: '#progetti', label: 'Progetti' },
  { href: '#bandi', label: 'Bandi' },
  { href: '#newsletter', label: 'Newsletter' },
  { href: '#infosfera', label: 'Infosfera' },
  { href: '/chi-siamo.html', label: 'Chi Siamo' },
] as const

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
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
          <img src="/assets/logo DIH.svg" alt="Campania DIH" className="h-8 sm:h-10 block" />
        </a>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={getLinkHref(link.href)}
              className="text-[15px] font-normal text-[#E3EAEC] hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex">
          <Button
            asChild
            className="bg-[#8EBEF7] text-[#013167] hover:bg-white hover:translate-y-0 px-6 rounded-xl font-bold"
          >
            <a href={getLinkHref('#contatti')}>Contattaci</a>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center size-10 rounded-lg bg-[#E3EAEC] text-brand-dark-navy hover:bg-white transition-colors"
              aria-label="Apri menu"
            >
              <MenuIcon className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] sm:w-80">
            <SheetHeader>
              <SheetTitle>
                <img
                  src="/assets/logo DIH.svg"
                  alt="Campania DIH"
                  className="h-10 brightness-[10]"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <a
                    href={getLinkHref(link.href)}
                    className="px-3 py-3 rounded-md text-base text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {link.label}
                  </a>
                </SheetClose>
              ))}
            </div>
            <SheetClose asChild>
              <Button
                asChild
                className="mt-6 w-full bg-[#8EBEF7] text-[#013167] hover:bg-white font-bold"
              >
                <a href={getLinkHref('#contatti')}>Contattaci</a>
              </Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
