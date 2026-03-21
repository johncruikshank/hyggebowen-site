import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

interface HeroProps {
  image: string
  eyebrow: string
  title: React.ReactNode
  subtitle: string
  ctas?: Array<{ label: string; href: string; ghost?: boolean }>
}

export default function Hero({ image, eyebrow, title, subtitle, ctas = [] }: HeroProps) {
  return (
    <section className="relative w-full h-screen min-h-96 flex items-end overflow-hidden">
      {/* Background Image */}
      <motion.img
        src={image}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, delay: 0.2, ease: "easeOut" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent opacity-70" />

      {/* Content */}
      <div className="relative z-20 w-full px-6 sm:px-12 md:px-20 pb-12 sm:pb-20 max-w-4xl">
        <motion.div
          className="font-sans text-xs font-medium tracking-widest uppercase text-rust"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {eyebrow}
        </motion.div>

        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light italic leading-tight mt-5 mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="font-sans text-sm sm:text-base font-light leading-relaxed text-opacity-60 text-cream max-w-2xl mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.9 }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.3 }}
        >
          {ctas.map((cta, i) => (
            <Link
              key={i}
              to={cta.href}
              className={`btn px-9 py-3.5 text-center ${cta.ghost ? 'btn-ghost' : ''}`}
            >
              {cta.label}
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-rust to-transparent"
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}
