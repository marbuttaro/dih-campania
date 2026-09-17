import { ContactFormCard } from './ContactFormCard'

export function ContactPrefooter() {
  return (
    <div
      id="contatti"
      className="w-full relative sm:bg-[url('/assets/sfondo_form.png')] sm:bg-cover sm:bg-center pt-28 sm:pt-32 pb-0 sm:pb-32 scroll-mt-28"
    >
      <div className="container-page relative z-10">
        <ContactFormCard />
      </div>
    </div>
  )
}
