import Hero from '../components/Hero'
import ScrollReveal from '../components/ScrollReveal'
import { Link } from 'react-router-dom'

export default function TheLandPage() {
  return (
    <div>
      <Hero
        image="/images/Arbutus-Ridge-0073.JPG"
        eyebrow="The Land"
        title="4.2 hectares of coastal forest."
        subtitle="Not a suburban lot. Not a resort. A living, breathing forest with trails, clearings, and a caretaker's presence."
      />

      {/* Main Content */}
      <section className="py-20 sm:py-32 md:py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light mb-8">Location & Access</h2>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              1620 Joan Audrey Lane, Bowen Island, BC V0N 1G0
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              Twenty minutes by ferry from Vancouver, or forty-five by car and ferry combined. Close enough to access the city's culture and healthcare. Remote enough to feel like escape.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6 mt-12">The Place Itself</h3>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              4.2 hectares (10.4 acres) of protected Pacific coastal forest. Dense Douglas fir and western hemlock at the top, arbutus and Garry oak in the clearings. The land slopes gently toward King Edward Bay.
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              There are natural clearings where the fourteen cottages will cluster. Walking trails weave through the mature forest. The forest floor—soft with cedar duff and moss—is left largely undisturbed.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6 mt-12">Zoning & Regulatory</h3>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              The land is zoned CD-18 Area 2 (Comprehensive Development Area). This zoning allows for clustered residential development with shared amenities and community spaces—perfect for an intentional community model.
            </p>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream">
              The project has received development approval from the Bowen Island Municipality and the Squamish Nation.
            </p>
          </ScrollReveal>

          {/* Feature Grid */}
          <ScrollReveal delay={0.3} className="mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="font-serif text-lg font-light mb-3">Native Forest</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Mature Douglas fir, hemlock, arbutus, and cedar. Understory of Oregon grape and sword fern. Wildlife corridors protected and enhanced.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg font-light mb-3">Water & Utilities</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Safe, reliable water supply. Modern septic and stormwater management. Underground utilities. Fiber-optic internet ready.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg font-light mb-3">Trails & Commons</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Miles of private walking trails. Central common house and gardens. Gathering spaces designed for community.
                </p>
              </div>
              <div>
                <h4 className="font-serif text-lg font-light mb-3">Environmental Care</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  No clear-cutting. Selective thinning for forest health. Invasive species management. Habitat restoration.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4} className="mt-12">
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream">
              The land is not for looking at from a distance. It's for walking through, for sitting in, for living on. It's a working forest that happens to be home.
            </p>
          </ScrollReveal>
        </div>
      </section>


      {/* 3D Map teaser */}
      <section className="py-16 sm:py-24 px-6 border-t border-cream border-opacity-5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <ScrollReveal>
            <p className="section-label">The Map</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light mt-4 mb-4">Walk the land before you walk the land.</h2>
            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-cream text-opacity-60 mb-6">Every lot, the strata road, the pond and the forest, on the surveyed ground. Turn it, tilt it, and see how the clearings sit against the slope.</p>
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
              Walk the land. Feel the place. See if it chooses you.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link to="/connect" className="btn px-9 py-3.5 inline-block">
              Request a Site Visit
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
