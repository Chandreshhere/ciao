import { useRef } from 'react'
import PageTransition from '@/components/animations/PageTransition'
import Hero from '@/components/Hero'
import IntroSection from '@/components/IntroSection'
import BestsellersSection from '@/components/BestsellersSection'
import CelebrateSection from '@/components/CelebrateSection'
import SweetMarquee from '@/components/SweetMarquee'
import NewsletterSection from '@/components/NewsletterSection'

// Home is the existing scroll experience minus chef sections. The
// 3D donut + hand live at App.tsx level so they escape the Layout's
// z-10 main wrapper (their fixed z-40 needs an unrestricted stacking
// context). CelebrationSection + AboutSection moved to /the-chef.
export default function Home() {
  // CelebrateDonut starts its journey as Bestsellers enters the viewport,
  // so it needs to know where that section sits in the layout.
  const bestsellersRef = useRef<HTMLElement>(null)

  return (
    <PageTransition>
      <Hero />
      <IntroSection />
      <BestsellersSection ref={bestsellersRef} />
      <CelebrateSection bestsellersRef={bestsellersRef} />
      <SweetMarquee />
      <NewsletterSection />
    </PageTransition>
  )
}
