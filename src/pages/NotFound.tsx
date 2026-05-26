import { Link } from 'react-router-dom'
import PageTransition from '@/components/animations/PageTransition'

export default function NotFound() {
  return (
    <PageTransition>
      <section className="flex min-h-screen flex-col items-center justify-center bg-[#F5F0E8] px-6 py-32 text-center">
        <span className="text-xs font-black uppercase tracking-[0.4em] text-[#157c99]">
          Off-menu
        </span>
        <h1 className="font-satt mt-6 text-[40vw] uppercase leading-none tracking-tighter text-[#157c99] md:text-[18vw]">
          404
        </h1>
        <p className="mt-6 max-w-[40ch] text-base font-bold text-[#157c99]/75 md:text-lg">
          This page isn't on the menu. Let's get you back to something sweet.
        </p>
        <Link
          to="/"
          className="font-satt mt-10 inline-flex items-center gap-3 rounded-full bg-[#1a1a1a] px-8 py-4 text-sm uppercase tracking-[0.3em] text-[#FBF8EF] transition-transform hover:-translate-y-0.5 md:text-base"
        >
          <span>Back to Home</span>
          <span aria-hidden>→</span>
        </Link>
      </section>
    </PageTransition>
  )
}
