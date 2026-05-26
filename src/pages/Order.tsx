import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '@/components/animations/PageTransition'
import Reveal from '@/components/animations/Reveal'

// /order — Reserve. Form fields collect Name / Phone / Category / Flavour /
// Required Date / Notes, then build a prefilled WhatsApp deep-link. A
// "skip the form" prominent CTA sits up top for users who want to message
// directly. The WhatsApp number reuses the existing one from Footer; swap
// `WHATSAPP` with the real business line when supplied.

const WHATSAPP = '919876543210'

const CATEGORIES = [
  'Signature Chocolate',
  'Fruit Cakes',
  'Patisserie',
  'Puddings & Shots',
  'Gifting',
  'Bespoke / Custom',
]

interface FormState {
  name: string
  phone: string
  category: string
  flavour: string
  date: string
  notes: string
}

const empty: FormState = {
  name: '',
  phone: '',
  category: '',
  flavour: '',
  date: '',
  notes: '',
}

function buildWhatsAppLink(f: FormState) {
  const lines = [
    "Hi Ciao! I'd like to place an order.",
    '',
    `Name: ${f.name || '—'}`,
    `Phone: ${f.phone || '—'}`,
    `Category: ${f.category || '—'}`,
    `Flavour: ${f.flavour || '—'}`,
    `Required by: ${f.date || '—'}`,
    `Notes: ${f.notes || '—'}`,
  ]
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`
}

const QUICK_LINK = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Hi Ciao! I'd like to place an order — could you walk me through the options?",
)}`

const today = () => new Date().toISOString().split('T')[0]

export default function Order() {
  const [form, setForm] = useState<FormState>(empty)

  const onChange = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((s) => ({ ...s, [k]: e.target.value }))

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.open(buildWhatsAppLink(form), '_blank', 'noopener,noreferrer')
  }

  return (
    <PageTransition>
      <section className="relative bg-[#F5F0E8] pt-36 pb-32 md:pt-44 md:pb-44">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-16">
          {/* Left column — title + intro */}
          <div>
            <Reveal>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#157c99]" />
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[#157c99]">
                  Reserve
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-satt mb-6 text-[18vw] uppercase leading-[0.9] tracking-tighter md:text-[7vw]">
                Place your{' '}
                <span className="text-[#157c99]">order</span>.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mb-8 max-w-[42ch] text-base font-bold text-[#157c99]/75 md:text-lg">
                Fill in the details — we'll confirm availability and pickup or
                delivery on WhatsApp.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <a
                href={QUICK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-satt inline-flex items-center gap-3 rounded-full bg-[#1a1a1a] px-8 py-4 text-sm uppercase tracking-[0.3em] text-[#FBF8EF] transition-transform hover:-translate-y-0.5 md:text-base"
              >
                <span>Order on WhatsApp</span>
                <span aria-hidden>→</span>
              </a>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="mt-8 max-w-[42ch] text-xs font-black uppercase tracking-[0.3em] text-[#157c99]/60 md:text-[11px]">
                Allow 24–48 hours · Custom cakes 3–5 days
              </p>
            </Reveal>
          </div>

          {/* Right column — form */}
          <Reveal delay={0.2}>
            <form
              onSubmit={onSubmit}
              // overflow-hidden + min-w-0 guarantees the rounded card
              // clips any input that still asserts a UA min-width on
              // iOS, instead of letting it overflow the border.
              className="min-w-0 overflow-hidden rounded-[2rem] border-2 border-[#157c99] bg-[#FBF8EF] p-6 md:p-10"
            >
              <Field
                label="Name"
                input={
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={onChange('name')}
                    className="w-full rounded-full border border-[#157c99]/25 bg-white px-5 py-3 text-sm font-bold text-[#1a1a1a] outline-none transition-colors focus:border-[#157c99]"
                  />
                }
              />

              <Field
                label="Phone"
                input={
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    value={form.phone}
                    onChange={onChange('phone')}
                    placeholder="+91"
                    className="w-full rounded-full border border-[#157c99]/25 bg-white px-5 py-3 text-sm font-bold text-[#1a1a1a] outline-none transition-colors focus:border-[#157c99]"
                  />
                }
              />

              <Field
                label="Category"
                input={
                  <select
                    required
                    value={form.category}
                    onChange={onChange('category')}
                    className="w-full appearance-none rounded-full border border-[#157c99]/25 bg-white px-5 py-3 text-sm font-bold text-[#1a1a1a] outline-none transition-colors focus:border-[#157c99]"
                  >
                    <option value="" disabled>
                      Choose a category…
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                }
              />

              <Field
                label="Flavour"
                input={
                  <input
                    type="text"
                    value={form.flavour}
                    onChange={onChange('flavour')}
                    placeholder="e.g. Dark Truffle, Mango Passion…"
                    className="w-full rounded-full border border-[#157c99]/25 bg-white px-5 py-3 text-sm font-bold text-[#1a1a1a] outline-none transition-colors focus:border-[#157c99]"
                  />
                }
              />

              <Field
                label="Required Date"
                input={
                  <input
                    type="date"
                    required
                    min={today()}
                    value={form.date}
                    onChange={onChange('date')}
                    className="w-full rounded-full border border-[#157c99]/25 bg-white px-5 py-3 text-sm font-bold text-[#1a1a1a] outline-none transition-colors focus:border-[#157c99]"
                  />
                }
              />

              <Field
                label="Additional Details"
                input={
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={onChange('notes')}
                    placeholder="Serving size, occasion, dietary notes…"
                    className="w-full rounded-[1.25rem] border border-[#157c99]/25 bg-white px-5 py-3 text-sm font-bold text-[#1a1a1a] outline-none transition-colors focus:border-[#157c99]"
                  />
                }
              />

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="font-satt mt-2 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#157c99] px-8 py-4 text-sm uppercase tracking-[0.3em] text-[#FBF8EF] transition-shadow hover:shadow-[0_12px_24px_-12px_rgba(21,124,153,0.55)] md:text-base"
              >
                <span>Send via WhatsApp</span>
                <span aria-hidden>→</span>
              </motion.button>

              <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#157c99]/55">
                We reply within working hours
              </p>
            </form>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  )
}

function Field({ label, input }: { label: string; input: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-[#157c99]">
        {label}
      </label>
      {input}
    </div>
  )
}
