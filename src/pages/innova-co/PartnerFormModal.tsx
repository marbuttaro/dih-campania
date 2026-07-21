import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 1 | 2 | 3

type Adesione = 'Quota Finanziaria' | 'Beni' | 'Attività Finanziarie/Servizi'

interface FormState {
  denominazionePartner: string
  legaleRappresentante: string
  piva: string
  sedeLegaleVia: string
  sedeLegaleCitta: string
  sedeLegaleProvincia: string
  sedeLegaleCap: string
  sedeOperativaVia: string
  sedeOperativaCitta: string
  sedeOperativaProvincia: string
  sedeOperativaCap: string
  tipologiaPartner: string
  descrizionePartner: string
  motivazioneAdesione: string
  modalitaAdesione: Adesione[]
  tipologiaBeniServizi: string
  altreInformazioni: string
  nome: string
  cognome: string
  ruolo: string
  telefono: string
  email: string
  iscrizioneConfindustria: 'iscritto' | 'non_iscritto' | null
  associazioneTerritoriale: string
  consensoDati: boolean
  consensoPrivacy: boolean
}

const INITIAL_STATE: FormState = {
  denominazionePartner: '',
  legaleRappresentante: '',
  piva: '',
  sedeLegaleVia: '',
  sedeLegaleCitta: '',
  sedeLegaleProvincia: '',
  sedeLegaleCap: '',
  sedeOperativaVia: '',
  sedeOperativaCitta: '',
  sedeOperativaProvincia: '',
  sedeOperativaCap: '',
  tipologiaPartner: '',
  descrizionePartner: '',
  motivazioneAdesione: '',
  modalitaAdesione: [],
  tipologiaBeniServizi: '',
  altreInformazioni: '',
  nome: '',
  cognome: '',
  ruolo: '',
  telefono: '',
  email: '',
  iscrizioneConfindustria: null,
  associazioneTerritoriale: '',
  consensoDati: false,
  consensoPrivacy: false,
}

function Field({
  label,
  value,
  onChange,
  className,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
  type?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="block text-sm font-semibold text-brand-navy mb-2">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#E7EDF0] rounded-lg px-4 py-3 text-brand-dark-navy placeholder:text-brand-navy/30 border-0 shadow-[inset_2px_2px_5px_rgba(164,177,188,0.35),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] focus:outline-none focus:ring-2 focus:ring-brand-light-blue/50 transition-shadow"
      />
    </label>
  )
}

function Checkbox({
  checked,
  onChange,
  children,
  className,
}: {
  checked: boolean
  onChange: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <label
      onClick={(e) => {
        e.preventDefault()
        onChange()
      }}
      className={cn('flex items-start gap-3 cursor-pointer select-none', className)}
    >
      <span
        className={cn(
          'mt-0.5 shrink-0 size-5 rounded-md flex items-center justify-center transition-colors',
          checked
            ? 'bg-brand-navy'
            : 'bg-[#E7EDF0] shadow-[inset_1px_1px_3px_rgba(164,177,188,0.4),inset_-1px_-1px_3px_rgba(255,255,255,0.7)]',
        )}
      >
        {checked && <Check className="size-3.5 text-white" strokeWidth={3} />}
      </span>
      <span className="text-sm text-brand-dark-navy/85 leading-relaxed">{children}</span>
    </label>
  )
}

function NavButton({
  direction,
  children,
  onClick,
  disabled,
}: {
  direction: 'back' | 'forward'
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  const icon =
    direction === 'back' ? (
      <ArrowLeft className="size-4" />
    ) : (
      <ArrowRight className="size-4" />
    )
  const arrowButton = (
    <span
      className={cn(
        'inline-flex items-center justify-center size-9 rounded-xl bg-[#E7EDF0] text-brand-light-blue shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(164,177,188,0.45)]',
        disabled && 'opacity-40',
      )}
    >
      {icon}
    </span>
  )

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-3 font-semibold text-brand-dark-navy transition-opacity',
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80',
      )}
    >
      {direction === 'back' && arrowButton}
      <span>{children}</span>
      {direction === 'forward' && arrowButton}
    </button>
  )
}

export function PartnerFormModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [submitted, setSubmitted] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleAdesione = (value: Adesione) =>
    setForm((f) => ({
      ...f,
      modalitaAdesione: f.modalitaAdesione.includes(value)
        ? f.modalitaAdesione.filter((v) => v !== value)
        : [...f.modalitaAdesione, value],
    }))

  const toggleIscrizione = (value: 'iscritto' | 'non_iscritto') =>
    setForm((f) => ({
      ...f,
      iscrizioneConfindustria: f.iscrizioneConfindustria === value ? null : value,
    }))

  const resetAndClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep(1)
      setForm(INITIAL_STATE)
      setSubmitted(false)
    }, 300)
  }

  const canSubmit = form.consensoDati && form.consensoPrivacy

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitted(true)
    setTimeout(resetAndClose, 2500)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) resetAndClose()
        else onOpenChange(next)
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-white/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[820px] max-h-[88vh] overflow-y-auto rounded-[32px] sm:rounded-[40px] bg-[#EDF1F3] p-8 sm:p-14 shadow-[0_30px_60px_rgba(0,25,51,0.18),0_10px_25px_rgba(0,25,51,0.08)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <Dialog.Close className="absolute right-6 top-6 sm:right-8 sm:top-8 inline-flex items-center justify-center size-9 rounded-xl bg-[#E7EDF0] text-brand-navy/60 hover:text-brand-navy shadow-[-2px_-2px_6px_rgba(255,255,255,0.8),2px_2px_6px_rgba(164,177,188,0.45)] transition-colors">
            <X className="size-4" />
            <span className="sr-only">Chiudi</span>
          </Dialog.Close>

          <Dialog.Title className="sr-only">Richiesta di adesione a Innova.CO</Dialog.Title>
          <Dialog.Description className="sr-only">
            Form in più passaggi per proporre il tuo servizio alla community Innova.CO
          </Dialog.Description>

          {submitted ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="size-16 rounded-full bg-brand-light-blue/20 flex items-center justify-center mb-5 border border-brand-light-blue/40">
                <Check className="size-8 text-brand-navy" strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-semibold text-brand-navy mb-2">
                Richiesta Inviata!
              </h3>
              <p className="text-brand-dark-navy/70">
                Grazie per la tua proposta, ti ricontatteremo il prima possibile.
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-light text-brand-navy text-center mb-10">
                    Anagrafica Partner
                  </h2>

                  <div className="space-y-5">
                    <Field
                      label="Denominazione Partner"
                      value={form.denominazionePartner}
                      onChange={(v) => set('denominazionePartner', v)}
                    />
                    <Field
                      label="Legale Rappresentante"
                      value={form.legaleRappresentante}
                      onChange={(v) => set('legaleRappresentante', v)}
                    />
                    <Field label="P.IVA o C.F." value={form.piva} onChange={(v) => set('piva', v)} />

                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-brand-navy mb-4">Sede Legale</h3>
                      <div className="space-y-4">
                        <Field label="Via" value={form.sedeLegaleVia} onChange={(v) => set('sedeLegaleVia', v)} />
                        <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
                          <Field label="Città" value={form.sedeLegaleCitta} onChange={(v) => set('sedeLegaleCitta', v)} />
                          <Field label="Provincia" value={form.sedeLegaleProvincia} onChange={(v) => set('sedeLegaleProvincia', v)} />
                          <Field label="CAP" value={form.sedeLegaleCap} onChange={(v) => set('sedeLegaleCap', v)} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-brand-navy mb-4">Sede Operativa</h3>
                      <div className="space-y-4">
                        <Field label="Via" value={form.sedeOperativaVia} onChange={(v) => set('sedeOperativaVia', v)} />
                        <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
                          <Field label="Città" value={form.sedeOperativaCitta} onChange={(v) => set('sedeOperativaCitta', v)} />
                          <Field label="Provincia" value={form.sedeOperativaProvincia} onChange={(v) => set('sedeOperativaProvincia', v)} />
                          <Field label="CAP" value={form.sedeOperativaCap} onChange={(v) => set('sedeOperativaCap', v)} />
                        </div>
                      </div>
                    </div>

                    <Field
                      label="Tipologia Partner"
                      value={form.tipologiaPartner}
                      onChange={(v) => set('tipologiaPartner', v)}
                      className="pt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-12">
                    <NavButton direction="back" onClick={resetAndClose}>
                      Indietro
                    </NavButton>
                    <NavButton direction="forward" onClick={() => setStep(2)}>
                      Avanti
                    </NavButton>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-light text-brand-navy text-center mb-2">
                    Informazioni Generali
                  </h2>
                  <p className="text-center text-brand-dark-navy/60 mb-10">
                    del partner e della sua attività
                  </p>

                  <div className="space-y-5">
                    <Field
                      label="Descrizione Partner e attività"
                      value={form.descrizionePartner}
                      onChange={(v) => set('descrizionePartner', v)}
                    />
                    <Field
                      label="Motivazione di adesione alla Community"
                      value={form.motivazioneAdesione}
                      onChange={(v) => set('motivazioneAdesione', v)}
                    />

                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-brand-navy mb-4">
                        Modalità di Adesione
                      </h3>
                      <div className="space-y-3">
                        {(['Quota Finanziaria', 'Beni', 'Attività Finanziarie/Servizi'] as Adesione[]).map(
                          (option) => (
                            <Checkbox
                              key={option}
                              checked={form.modalitaAdesione.includes(option)}
                              onChange={() => toggleAdesione(option)}
                            >
                              {option}
                            </Checkbox>
                          ),
                        )}
                      </div>
                    </div>

                    <Field
                      label="In caso di Beni o Attività Finanziarie/Servizi esplicitare la tipologia:"
                      value={form.tipologiaBeniServizi}
                      onChange={(v) => set('tipologiaBeniServizi', v)}
                    />

                    <Field
                      label="Altre informazioni"
                      value={form.altreInformazioni}
                      onChange={(v) => set('altreInformazioni', v)}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-12">
                    <NavButton direction="back" onClick={() => setStep(1)}>
                      Indietro
                    </NavButton>
                    <NavButton direction="forward" onClick={() => setStep(3)}>
                      Avanti
                    </NavButton>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-3xl sm:text-4xl font-light text-brand-navy text-center mb-2">
                    Riferimenti
                  </h2>
                  <p className="text-center text-brand-dark-navy/60 mb-10">Referente</p>

                  <div className="space-y-5">
                    <Field label="Nome" value={form.nome} onChange={(v) => set('nome', v)} />
                    <Field label="Cognome" value={form.cognome} onChange={(v) => set('cognome', v)} />
                    <Field label="Ruolo" value={form.ruolo} onChange={(v) => set('ruolo', v)} />
                    <Field
                      label="Numero di Telefono"
                      value={form.telefono}
                      onChange={(v) => set('telefono', v)}
                      type="tel"
                    />
                    <Field label="Mail" value={form.email} onChange={(v) => set('email', v)} type="email" />

                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-brand-navy mb-4">Il Partner è:</h3>
                      <div className="space-y-4">
                        <Checkbox
                          checked={form.iscrizioneConfindustria === 'iscritto'}
                          onChange={() => toggleIscrizione('iscritto')}
                        >
                          iscritto alla Associazione Territoriale di Confindustria di
                        </Checkbox>
                        {form.iscrizioneConfindustria === 'iscritto' && (
                          <Field
                            label=""
                            value={form.associazioneTerritoriale}
                            onChange={(v) => set('associazioneTerritoriale', v)}
                            className="ml-8 [&>span]:hidden"
                          />
                        )}
                        <Checkbox
                          checked={form.iscrizioneConfindustria === 'non_iscritto'}
                          onChange={() => toggleIscrizione('non_iscritto')}
                        >
                          non iscritto a nessuna Associazione Territoriale di Confindustria
                        </Checkbox>
                      </div>
                    </div>

                    <div className="pt-4 space-y-4">
                      <Checkbox
                        checked={form.consensoDati}
                        onChange={() => set('consensoDati', !form.consensoDati)}
                        className="italic"
                      >
                        Dichiaro di essere autorizzato a fornire i dati dell'azienda e i propri
                        dati di contatto per le finalità connesse alla richiesta di adesione alla
                        Community.
                      </Checkbox>
                      <Checkbox
                        checked={form.consensoPrivacy}
                        onChange={() => set('consensoPrivacy', !form.consensoPrivacy)}
                        className="italic"
                      >
                        Dichiaro di aver letto e compreso l'Informativa sul trattamento dei dati
                        personali ai sensi del Regolamento (UE) 2016/679 (GDPR) e acconsento al
                        trattamento dei dati per le finalità connesse alla gestione della
                        richiesta di iscrizione alla Community.{' '}
                        <span className="font-bold not-italic">Visualizza informativa Privacy.</span>
                      </Checkbox>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-12">
                    <NavButton direction="back" onClick={() => setStep(2)}>
                      Indietro
                    </NavButton>
                    <NavButton direction="forward" onClick={handleSubmit} disabled={!canSubmit}>
                      Invia la tua proposta
                    </NavButton>
                  </div>
                </div>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
