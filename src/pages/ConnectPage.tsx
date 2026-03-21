import React, { useState } from 'react'
import ScrollReveal from '../components/ScrollReveal'

export default function ConnectPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, this would send to a backend service
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-forest pt-32 pb-20">
      <section className="py-20 sm:py-32 md:py-40 px-6">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light italic mb-6">
              Begin the conversation.
            </h1>
            <p className="font-sans text-base font-light text-opacity-60 text-cream leading-relaxed mb-12">
              Tell us about yourself. What brings you here? What are you looking for? No pressure—just a real conversation about a place worth knowing.
            </p>
          </ScrollReveal>

          {submitted ? (
            <ScrollReveal>
              <div className="bg-bark border border-opacity-10 border-rust p-8 rounded text-center">
                <p className="font-sans text-lg font-light text-rust">
                  Thank you for reaching out. We'll be in touch soon.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-sans text-sm font-light text-opacity-70 text-cream mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-bark border border-opacity-10 border-cream text-cream font-sans font-light px-4 py-3 focus:border-opacity-30 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-light text-opacity-70 text-cream mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-bark border border-opacity-10 border-cream text-cream font-sans font-light px-4 py-3 focus:border-opacity-30 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm font-light text-opacity-70 text-cream mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-bark border border-opacity-10 border-cream text-cream font-sans font-light px-4 py-3 focus:border-opacity-30 focus:outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn px-9 py-3.5 w-full text-center"
                >
                  Send Message
                </button>
              </form>
            </ScrollReveal>
          )}

          <ScrollReveal delay={0.2} className="mt-16 pt-16 border-t border-opacity-5 border-cream">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-light mb-2">Call Us</h3>
                <a href="tel:6043322032" className="font-sans text-base font-light text-rust hover:text-rust-glow transition">
                  604-332-2032
                </a>
              </div>

              <div>
                <h3 className="font-serif text-lg font-light mb-2">Email Us</h3>
                <a href="mailto:info@hyggebowen.com" className="font-sans text-base font-light text-rust hover:text-rust-glow transition">
                  info@hyggebowen.com
                </a>
              </div>

              <div>
                <h3 className="font-serif text-lg font-light mb-2">Visit Us</h3>
                <p className="font-sans text-base font-light text-opacity-60 text-cream">
                  1620 Joan Audrey Lane<br />
                  Bowen Island, BC V0N 1G0<br />
                  Canada
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
