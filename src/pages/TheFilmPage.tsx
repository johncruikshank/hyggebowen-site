import React from 'react'
import ScrollReveal from '../components/ScrollReveal'

export default function TheFilmPage() {
  return (
    <div className="min-h-screen bg-forest pt-32">
      <section className="py-20 sm:py-32 md:py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light italic mb-6">The Film</h1>
            <p className="font-sans text-base font-light text-opacity-60 text-cream leading-relaxed mb-12">
              A five-minute documentary film tells the story of Hygge Bowen — why it exists, who it's for, and what home means when you find the place that chooses you.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="relative w-full bg-bark rounded overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Hygge Bowen Documentary"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="mt-12">
            <p className="font-sans text-base font-light text-opacity-60 text-cream leading-relaxed">
              Watch to meet the founding residents, tour the land, and hear directly why this place matters.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
