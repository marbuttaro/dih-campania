import { useState, type FormEvent } from 'react'

export function ContactFormCard() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' })
    }, 3000)
  }

  return (
    <div className="-mx-8 sm:mx-auto sm:max-w-[920px] rounded-none sm:rounded-[30px] p-8 sm:p-12 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-[3px] glass-stroke-container bg-[url('/assets/sfondo_contatti_mobile.png')] bg-cover bg-center sm:bg-none">

      {/* Ambient inner glow */}
      <div className="absolute -top-40 -right-40 size-80 bg-brand-light-blue/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 text-center mb-8">
        <h2 className="text-[48px] sm:text-[2.1rem] leading-[1.1] sm:leading-normal font-light mb-2 text-white tracking-tight">
          Pronto per iniziare?
        </h2>
        <p className="text-sm sm:text-base text-brand-light-blue/80 font-normal">
          Compila il form per richiedere informazioni
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-12 flex flex-col items-center justify-center">
          <div className="size-16 rounded-full bg-brand-light-blue/20 flex items-center justify-center mb-4 border border-brand-light-blue/40">
            <svg className="size-8 text-brand-light-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Richiesta Inviata!</h3>
          <p className="text-brand-light-blue/80">Grazie, ti contatteremo il prima possibile.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col glass-stroke-input-wrapper">
              <input
                type="text"
                placeholder="First Name"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
              />
            </div>
            <div className="flex flex-col glass-stroke-input-wrapper">
              <input
                type="text"
                placeholder="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
              />
            </div>
          </div>

          <div className="glass-stroke-input-wrapper">
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
            />
          </div>

          <div className="glass-stroke-input-wrapper">
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm"
            />
          </div>

          <div className="glass-stroke-input-wrapper">
            <textarea
              placeholder="Message"
              rows={6}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full block glass-stroke-input rounded-[12px] px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-brand-light-blue transition-colors text-sm resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#013167] text-white hover:bg-brand-light-blue hover:text-brand-dark-navy transition-all duration-300 font-semibold py-4 rounded-[12px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 border border-white/10 cursor-pointer"
            >
              Invia Richiesta
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
