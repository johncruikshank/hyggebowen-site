import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ScrollReveal from '../components/ScrollReveal'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <Hero
        image="/images/Arbutus-Ridge-4741.jpeg"
        eyebrow="Bowen Island, British Columbia"
        title="The place that chooses you."
        subtitle="Fourteen covenant-protected cottages on 8.5 acres of Pacific coastal forest. Twenty minutes from Vancouver. Built around a simple Danish idea: that the best things in life happen together."
        ctas={[
          { label: 'Explore the Homes', href: '/the-homes' },
          { label: 'Watch the Film', href: '/the-film', ghost: true }
        ]}
      />

      {/* Philosophy */}
      <section className="py-20 sm:py-32 md:py-40 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <p className="section-label">The Danish Idea</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl italic leading-relaxed mt-9 mb-7">
              Hygge isn't a style. It's the feeling of <span className="text-rust">warmth between people</span> — the quiet contentment of belonging somewhere made with you in mind.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-opacity-50 text-cream max-w-xl mx-auto">
              On the west shore of Bowen Island, in a clearing above King Edward Bay, we're building a place where that feeling isn't an accident. It's the architecture. The covenant. The forest itself.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="h-px w-10 bg-rust bg-opacity-30 mx-auto mt-12" />
          </ScrollReveal>
        </div>
      </section>

      {/* Image Band */}
      <div className="relative w-full h-96 sm:h-screen max-h-96 sm:max-h-full overflow-hidden">
        <img
          src="/images/Arbutus-Ridge-0073.JPG"
          alt="Bowen Island coastline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest via-transparent to-forest opacity-40" />
        <ScrollReveal className="absolute bottom-12 left-6 sm:left-12 z-10">
          <p className="font-serif text-lg sm:text-2xl italic text-opacity-60 text-cream">
            Bowen Island, looking toward the North Shore mountains
          </p>
        </ScrollReveal>
      </div>

      {/* Stats */}
      <section className="border-t border-opacity-5 border-cream py-12 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { num: '14', label: 'Cottage homes on strata lots' },
            { num: '8.5', label: 'Acres of protected forest' },
            { num: '20', label: 'Minutes from Vancouver' },
            { num: '1', label: 'Shared common house' }
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div>
                <div className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-rust mb-2">
                  {stat.num}
                </div>
                <p className="font-sans text-xs sm:text-sm font-light text-opacity-50 text-cream leading-relaxed">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* The Homes Split */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-96 sm:min-h-screen">
        <div className="relative overflow-hidden min-h-80 sm:min-h-full order-2 md:order-1">
          <img
            src="/images/mj-cottage-generous-01.png"
            alt="Cottage design"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 bg-bark order-1 md:order-2">
          <ScrollReveal>
            <p className="section-label">The Homes</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight mt-6 mb-6">
              Built to disappear into the forest
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-opacity-60 text-cream mb-4">
              800–1,500 square feet of timber, glass, and standing-seam metal. Every home is designed for universal access, net-zero energy, and the kind of warmth that comes from genuine craft.
            </p>

            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-opacity-60 text-cream">
              Zero-step entries. 36-inch doorways. Smart home systems that stay out of the way. Homes that work for your body and your life — now and as needs change.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Link to="/the-homes" className="inline-flex items-center gap-2 font-sans text-xs font-light tracking-widest text-rust hover:gap-4 transition-all mt-6">
              Explore the homes
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Community Split (Reversed) */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-96 sm:min-h-screen">
        <div className="relative overflow-hidden min-h-80 sm:min-h-full">
          <img
            src="/images/strongman-community-walk.jpg"
            alt="Community walking trail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 bg-bark">
          <ScrollReveal>
            <p className="section-label">The Community</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight mt-6 mb-6">
              A covenant, not just a contract
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-opacity-60 text-cream mb-4">
              Every homeowner signs a covenant that protects the community's character — who lives here, how the land is used, and what matters most. It's not an HOA. It's a shared commitment to a way of life.
            </p>

            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-opacity-60 text-cream">
              The common house, the trails, the shared garden — these will be shaped by the people who come. The founding residents build the culture together.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <Link to="/community" className="inline-flex items-center gap-2 font-sans text-xs font-light tracking-widest text-rust hover:gap-4 transition-all mt-6">
              Learn about ownership
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-32 md:py-40 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <ScrollReveal>
              <p className="section-label">What's Built In</p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light mt-6">
                Technology that stays out of the way
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: 'Universal Design', desc: 'Zero-step entries, 36" doorways, lever handles. Every home works for every body — now and as needs change.' },
              { title: 'Net-Zero Ready', desc: 'High-performance envelope, heat pumps standard, pre-wired for solar, EV charging at every lot.' },
              { title: 'Passive Safety', desc: 'Discreet sensors learn daily rhythms. Stove monitors, flood sensors, one-touch emergency — no wearables required.' },
              { title: 'Voice Control', desc: 'Pre-wired for lighting, temperature, locks, and appliances. Works with Alexa, Google, and HomeKit.' },
              { title: 'Privacy First', desc: 'You control what data is retained, who has access, and what notifications are sent. This is not surveillance.' },
              { title: 'Built to Last', desc: 'Timber frame, standing-seam metal, high-performance glazing. Materials that age beautifully in the coastal climate.' }
            ].map((feat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="border-t border-opacity-10 border-rust pt-6">
                  <h3 className="font-serif text-lg font-light mb-3">{feat.title}</h3>
                  <p className="font-sans text-sm font-light text-opacity-50 text-cream leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="relative py-24 sm:py-40 px-6 text-center overflow-hidden">
        <img
          src="/images/Arbutus-Ridge-4787.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-forest opacity-75" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl italic leading-tight">
              Begin the conversation.
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-opacity-60 text-cream mt-6 mb-8">
              We'd love to tell you more about what we're building — and to hear what you're looking for. No pressure. Just a real conversation about a place worth knowing.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Link to="/connect" className="btn px-9 py-3.5 inline-block">
              Connect With Us
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="font-sans text-xs text-opacity-50 text-cream tracking-widest mt-8">
              <a href="tel:6043322032" className="hover:text-opacity-70 transition">604-332-2032</a>
              <span> · </span>
              <a href="mailto:info@hyggebowen.com" className="hover:text-opacity-70 transition">info@hyggebowen.com</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
