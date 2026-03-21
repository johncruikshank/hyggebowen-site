import React from 'react'
import Hero from '../components/Hero'
import ScrollReveal from '../components/ScrollReveal'
import { Link } from 'react-router-dom'

export default function CommunityPage() {
  return (
    <div>
      <Hero
        image="/images/strongman-community-walk.jpg"
        eyebrow="Community"
        title="Built by intention, sustained by commitment."
        subtitle="A Housing Agreement. Four ownership pathways. A shared covenant to live together with care and purpose."
      />

      {/* Main Content */}
      <section className="py-20 sm:py-32 md:py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light mb-8">Who We Welcome</h2>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              Every household must include at least one resident who qualifies under our Housing Agreement:
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ul className="list-disc list-inside font-sans text-base font-light leading-relaxed text-opacity-60 text-cream space-y-3 mb-8">
              <li><strong className="text-cream">Seniors (55+)</strong> — We believe aging should be celebrated, not hidden away.</li>
              <li><strong className="text-cream">Adults with developmental disabilities</strong> — Down Syndrome, Autism, Cerebral Palsy, Traumatic Brain Injury, and similar conditions.</li>
              <li><strong className="text-cream">People with mobility or sensory disabilities</strong> — Physical or visual impairment that benefits from an accessible, supportive environment.</li>
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              This is not segregation. It's intentional inclusion. Families move here together. Caregivers, partners, friends, and adult children live alongside seniors and adults with disabilities, creating a multi-generational, neurodivergent-welcoming community.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6 mt-12">The Covenant</h3>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              A Housing Agreement—not an HOA. It's a legal covenant registered on every property that ensures:
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <ul className="list-disc list-inside font-sans text-base font-light leading-relaxed text-opacity-60 text-cream space-y-3 mb-8">
              <li>Occupancy by qualifying residents (with limited exceptions for caregivers)</li>
              <li>The community's affordable and accessible character is protected long-term</li>
              <li>Homes cannot be converted to short-term rentals or investment properties</li>
              <li>The land is used as intended: for living, community, and forest stewardship</li>
              <li>Residents commit to respecting neighbors, the forest, and shared spaces</li>
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6 mt-12">Ownership Pathways</h3>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-8">
              There are four ways to become part of Hygge Bowen:
            </p>
          </ScrollReveal>

          {/* Ownership Pathways Grid */}
          <ScrollReveal delay={0.6}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="border-l-2 border-rust pl-6">
                <h4 className="font-serif text-lg font-light mb-3">1. Traditional Purchase</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Buy your home outright or with a mortgage. Own your cottage while respecting the community covenant.
                </p>
              </div>
              <div className="border-l-2 border-rust pl-6">
                <h4 className="font-serif text-lg font-light mb-3">2. Co-Housing Model</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Shared ownership of land and commons, private home purchase. Strengthens community bonds.
                </p>
              </div>
              <div className="border-l-2 border-rust pl-6">
                <h4 className="font-serif text-lg font-light mb-3">3. Rent-to-Own</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  Live in a home, build equity over time, transition to ownership when ready.
                </p>
              </div>
              <div className="border-l-2 border-rust pl-6">
                <h4 className="font-serif text-lg font-light mb-3">4. Legacy Pathways</h4>
                <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  For families with special-needs members, supported living arrangements with on-site caretaker.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.7} className="mt-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6">The Common House</h3>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream mb-6">
              A gathering place designed for the community to share meals, celebrate, and support one another. Space for workshops, events, and informal gatherings. Managed by residents, shared costs.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <h3 className="font-serif text-2xl sm:text-3xl font-light mb-6">On-Site Support</h3>
            <p className="font-sans text-base font-light leading-relaxed text-opacity-60 text-cream">
              A full-time caretaker residence ensures there's always someone available to help with maintenance, safety checks, and community coordination. This is not a nursing home. It's a neighbor with a key to help.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-40 px-6 text-center bg-bark">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl italic mb-6">
              Ready to explore life here?
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link to="/connect" className="btn px-9 py-3.5 inline-block">
              Get the Full Covenant
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
