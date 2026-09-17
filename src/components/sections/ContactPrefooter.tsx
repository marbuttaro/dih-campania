import { ContactFormCard } from './ContactFormCard'

export function ContactPrefooter() {
  return (
    <div
      id="contatti"
      className="w-full relative sm:bg-[url('/assets/sfondo_form.png')] sm:bg-cover sm:bg-center pt-24 sm:pt-28 pb-0 scroll-mt-28"
    >
      <div className="container-page relative z-10">
        <ContactFormCard />
      </div>
    </div>
  )
}
