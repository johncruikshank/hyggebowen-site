import Hero from '../components/Hero'
import ScrollReveal from '../components/ScrollReveal'
import { Link } from 'react-router-dom'

export default function TheHomesPage() {
  return (
    <div>
      <Hero
        image="/images/mj-cottage-generous-01.png"
        eyebrow="The Homes"
        title="Built for life, designed for time."
        subtitle="Each cottage is a masterpiece of efficiency and accessibility — timber-framed, net-zero ready, and scaled for human connection."
      />

      {/* Main Content */}
      <section className="py-20 sm:py-32 md:py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light mb-8">Size & Scope</h2>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              Every cottage ranges from 800 to 1,500 square feet — roughly 160 to 250 square meters. This isn't accidental. It's the sweet spot between privacy and community, between spaciousness and intimacy.
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              Each home includes:
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ul className="list-disc list-inside font-sans text-base font-light leading-relaxed text-opacity-60 text-cream space-y-3 mb-8">
              <li>1–2 bedrooms with full accessibility</li>
              <li>1–1.5 bathrooms with accessible features</li>
              <li>Open-concept living / kitchen</li>
              <li>Covered outdoor space (deck or patio)</li>
              <li>In-unit laundry</li>
              <li>High-performance insulation and air sealing</li>
              <li>Triple-glazed windows with passive solar orientation</li>
              <li>Heat pump heating (pre-wired for solar PV)</li>
              <li>EV charging ready</li>
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6 mt-12">Universal Design Standard</h3>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              Universal design isn't a feature—it's foundational. Every home is built to work for people of all ages and abilities:
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <ul className="list-disc list-inside font-sans text-base font-light leading-relaxed text-opacity-60 text-cream space-y-3 mb-8">
              <li>Zero-step entry at front door (no threshold)</li>
              <li>36-inch minimum interior doorways</li>
              <li>Lever handles throughout (no knobs)</li>
              <li>Bathroom grab points pre-installed</li>
              <li>Accessible shower stalls with seating</li>
              <li>Raised electrical outlets and lowered switches</li>
              <li>Open-concept kitchens with roll-under counters</li>
              <li>Good sightlines and non-slip flooring</li>
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6 mt-12">Materials & Craft</h3>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream">
              Built to last 100+ years in a coastal climate. Solid timber frame with Douglas fir and local cedar. Standing-seam metal roofing in anthracite. Triple-glazed windows. Interior finishes in natural materials: plaster, wood, stone. No vinyl siding. No disposable architecture.
            </p>
          </ScrollReveal>

          {/* Feature Grid */}
          <ScrollReveal delay={0.5} className="mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-lg font-light mb-3">Net-Zero Ready</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  High-performance envelope, heat pumps, pre-wired for rooftop solar, battery-ready electrical panels, EV charging at every lot.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg font-light mb-3">Smart Home Ready</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Pre-wired for lighting, heating, security, and appliance control. Works with Alexa, Google, and HomeKit. Privacy-first approach.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg font-light mb-3">Passive Safety</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Optional sensors monitor daily patterns, stove use, and water leaks. One-touch emergency call buttons. No wearables needed.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg font-light mb-3">Outdoor Living</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Every cottage has dedicated outdoor space. Decks or patios face south for passive solar gain and warmth.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>


      {/* 3D Map teaser */}
      <section className="py-16 sm:py-24 px-6 border-t border-cream border-opacity-5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <ScrollReveal>
            <p className="section-label">The Map</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light mt-4 mb-4">See which home sits where.</h2>
            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-cream text-opacity-60 mb-6">Tap any lot on the 3D map to see the concept plan we have placed there, its size, and how it faces the road and the trees.</p>
            <Link to="/the-map" className="inline-flex items-center gap-2 font-sans text-xs font-light tracking-widest text-rust hover:gap-4 transition-all">
              Open the 3D site map
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Link to="/the-map" className="block rounded-lg overflow-hidden border border-cream border-opacity-10 bg-bark aspect-[4/3] relative group">
              <img src="/images/site-map-preview.jpg" alt="3D map of the Hygge Bowen site" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />
              <span className="absolute bottom-3 left-3 font-serif italic text-sm text-cream text-opacity-70">Sixteen lots on the surveyed ground</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>
      {/* CTA */}
      <section className="relative py-24 sm:py-40 px-6 text-center bg-bark">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl italic mb-6">
              A home built for who you are now, and who you'll become.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link to="/connect" className="btn px-9 py-3.5 inline-block">
              Schedule a Tour
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
