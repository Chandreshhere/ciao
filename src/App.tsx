import { useRef } from 'react'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import IntroSection from '@/components/IntroSection'
import BestsellersSection from '@/components/BestsellersSection'
import CelebrateSection from '@/components/CelebrateSection'
import SweetMarquee from '@/components/SweetMarquee'
import AboutSection from '@/components/AboutSection'
import CelebrationSection from '@/components/CelebrationSection'
import NewsletterSection from '@/components/NewsletterSection'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import DonutScene from '@/components/DonutScene'
import HandScene from '@/components/HandScene'

export default function App() {
  // Shared anchor: CelebrateDonut starts its journey as Bestsellers enters
  // the viewport (it slides in from off-screen left), so the donut needs to
  // know where that section lives in the layout.
  const bestsellersRef = useRef<HTMLElement>(null)

  return (
    <SmoothScroll>
      <Navbar />
      {/* Main content stack — sits ABOVE the fixed footer. Each section
          carries its own cream background, so the wrapper itself stays
          transparent: that lets the last section's rounded bottom corners
          actually cut into the blue footer beneath. `mb-[50vh]` reserves
          enough scroll for the footer to be revealed about halfway. */}
      <div className="relative z-10 mb-[50vh]">
        <Hero />
        {/* IntroSection is the pinned "section after the hero": its tall
            container gives the donut + hand choreography its scroll room
            while the intro text holds on top. */}
        <IntroSection />
        <BestsellersSection ref={bestsellersRef} />
        <CelebrateSection bestsellersRef={bestsellersRef} />
        <SweetMarquee />
        <AboutSection />
        <CelebrationSection />
        <NewsletterSection />
      </div>
      {/* DonutScene + HandScene are fixed-positioned layers — moved out
          of Hero (and out of the wrapper's z-10 stacking context) so
          their z-40 sits ABOVE the wrapper globally and they remain
          visible throughout the page instead of being capped to z-10. */}
      <DonutScene />
      <HandScene />
      <Footer />
    </SmoothScroll>
  )
}
