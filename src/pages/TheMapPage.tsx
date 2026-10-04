import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { VANTAGES, Vantage } from '../map/vantages'
import { LoadedSite, SQFT_PER_M2, describeUse, loadSiteData } from '../map/siteData'

const SiteMap3D = lazy(() => import('../components/SiteMap3D'))

const HOME_ORDER = ['Nightingale', 'Swallow', 'Osprey', 'Heron']

function fmt(n: number, digits = 0) {
  return n.toLocaleString('en-CA', { maximumFractionDigits: digits })
}

function LotCard({ site, lot, onClose }: { site: LoadedSite; lot: number; onClose: () => void }) {
  const l = site.data.lots.find((x) => x.lot === lot)
  if (!l) return null
  const home = site.data.homes[String(lot)]
  const type = home ? site.data.home_types[home.type] : null
  const isBarn = l.use.startsWith('commercial')
  return (
    <div className="site-map-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-label">Lot {l.lot}</p>
          <h3 className="font-serif text-2xl font-light mt-1">{isBarn ? 'The Barn' : type ? `The ${type.name}` : describeUse(l.use)}</h3>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-cream text-opacity-50 hover:text-opacity-100 transition text-xl leading-none">×</button>
      </div>
      <p className="font-sans text-sm font-light text-cream text-opacity-60 mt-2">{describeUse(l.use)}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 font-sans text-sm font-light">
        <div>
          <dt className="text-cream text-opacity-40 text-xs tracking-widest uppercase">Lot size</dt>
          <dd className="text-cream mt-1">{fmt(l.area_m2)} m² <span className="text-opacity-50 text-cream">· {fmt(l.area_m2 * SQFT_PER_M2)} sq ft</span></dd>
        </div>
        {type && (
          <>
            <div>
              <dt className="text-cream text-opacity-40 text-xs tracking-widest uppercase">Home</dt>
              <dd className="text-cream mt-1">approx. {fmt(type.sf)} sq ft</dd>
            </div>
            <div>
              <dt className="text-cream text-opacity-40 text-xs tracking-widest uppercase">Bedrooms</dt>
              <dd className="text-cream mt-1">{type.beds}</dd>
            </div>
            <div>
              <dt className="text-cream text-opacity-40 text-xs tracking-widest uppercase">Bathrooms</dt>
              <dd className="text-cream mt-1">{type.baths}</dd>
            </div>
          </>
        )}
      </dl>
      {isBarn ? (
        <p className="font-sans text-sm font-light text-cream text-opacity-60 mt-4 leading-relaxed">
          The shared common house at the entrance to the community, beside Joan Audrey Lane.
        </p>
      ) : (
        <p className="font-sans text-sm font-light text-cream text-opacity-60 mt-4 leading-relaxed">
          Single-level, zero-step entry, doorways at least 900 mm wide, lever handles, bathrooms built ready for future adaptation.
        </p>
      )}
      <p className="font-sans text-xs font-light text-cream text-opacity-40 mt-4 leading-relaxed">
        Concept plans shown as an example of a home we think suits this lot. Sizes are approximate and may change.
      </p>
      <Link to="/connect" className="btn px-6 py-2.5 text-xs inline-block mt-5">Ask about Lot {l.lot}</Link>
    </div>
  )
}

export default function TheMapPage() {
  const [selected, setSelected] = useState<number | null>(null)
  const [vantage, setVantage] = useState<Vantage>('overview')
  const [site, setSite] = useState<LoadedSite | null>(null)
  useEffect(() => {
    loadSiteData().then(setSite).catch(() => undefined)
  }, [])

  return (
    <div className="pt-16">
      {/* Intro */}
      <section className="px-6 pt-12 sm:pt-20 pb-8">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <p className="section-label">The Map</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light italic leading-tight mt-5 mb-6">
              Sixteen lots in the forest, as they will sit on the land.
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-cream text-opacity-60 max-w-2xl">
              Built from the surveyed ground, the engineer's lot plan and the strata road as drawn. Turn it, tilt it, and tap a lot to see which home we have placed there. The surrounding roads and the playground below are shown for bearings only.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Map */}
      <section className="px-0 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 px-6 sm:px-0 mb-3">
            {VANTAGES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVantage(v.id)}
                className={`site-map-chip ${vantage === v.id ? 'site-map-chip--active' : ''}`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="relative w-full h-[70vh] min-h-[420px] sm:rounded-lg overflow-hidden border border-cream border-opacity-10 bg-forest">
            <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center font-serif italic text-xl text-cream text-opacity-60">Loading the land…</div>}>
              <SiteMap3D selected={selected} onSelect={setSelected} vantage={vantage} />
            </Suspense>
            {site && selected !== null && (
              <div className="absolute left-0 right-0 bottom-0 sm:left-auto sm:right-4 sm:top-4 sm:bottom-auto sm:w-80 z-30">
                <LotCard site={site} lot={selected} onClose={() => setSelected(null)} />
              </div>
            )}
            <div className="absolute left-4 bottom-4 hidden sm:flex gap-4 font-sans text-xs text-cream text-opacity-60 z-20 pointer-events-none">
              <span className="site-map-key"><i style={{ background: '#8f9a6a' }} /> Cottage lot</span>
              <span className="site-map-key"><i style={{ background: '#9a9270' }} /> Caretaker</span>
              <span className="site-map-key"><i style={{ background: '#a08a68' }} /> The Barn</span>
              <span className="site-map-key"><i style={{ background: '#8d867a' }} /> Strata road</span>
              <span className="site-map-key"><i style={{ background: '#3f6f8c' }} /> Pond &amp; creek</span>
            </div>
          </div>
          <p className="font-sans text-xs font-light text-cream text-opacity-40 px-6 sm:px-0 mt-3 leading-relaxed">
            Drag to turn, scroll or pinch to zoom, right-drag or two fingers to pan. Home positions are provisional drawings, not committed plans.
          </p>
        </div>
      </section>

      {/* Lot index */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="section-label">The Lots</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light mt-4 mb-8">Fourteen cottages, a caretaker's home, and the Barn</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {site &&
              site.data.lots.map((l, i) => {
                const home = site.data.homes[String(l.lot)]
                const type = home ? site.data.home_types[home.type] : null
                const isBarn = l.use.startsWith('commercial')
                return (
                  <ScrollReveal key={l.lot} delay={Math.min(i * 0.03, 0.4)}>
                    <button
                      onClick={() => { setSelected(l.lot); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className={`site-map-lot ${selected === l.lot ? 'site-map-lot--active' : ''}`}
                    >
                      <span className="font-serif text-2xl font-light text-rust">{l.lot}</span>
                      <span className="block font-sans text-sm text-cream mt-1">{isBarn ? 'The Barn' : type ? `The ${type.name}` : describeUse(l.use)}</span>
                      <span className="block font-sans text-xs text-cream text-opacity-50 mt-1">
                        {fmt(l.area_m2)} m²{type ? ` · ${type.beds} bed · ${fmt(type.sf)} sq ft` : ''}
                      </span>
                    </button>
                  </ScrollReveal>
                )
              })}
          </div>
        </div>
      </section>

      {/* Home types */}
      <section className="py-16 sm:py-24 px-6 bg-bark">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="section-label">The Four Plans</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light mt-4 mb-4">Four concept homes, one standard</h2>
            <p className="font-sans text-sm sm:text-base font-light leading-relaxed text-cream text-opacity-60 max-w-2xl mb-10">
              Every home is single-level with a zero-step entry, doorways at least 900 mm wide, lever handles, and bathrooms built ready for future adaptation.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {site &&
              HOME_ORDER.map((name, i) => {
                const t = site.data.home_types[name]
                if (!t) return null
                const lots = Object.entries(site.data.homes).filter(([, h]) => h.type === name).map(([k]) => Number(k)).sort((a, b) => a - b)
                return (
                  <ScrollReveal key={name} delay={i * 0.1}>
                    <div className="border-t border-rust border-opacity-20 pt-6">
                      <h3 className="font-serif text-2xl font-light">The {t.name}</h3>
                      <p className="font-sans text-sm font-light text-cream text-opacity-60 mt-2 leading-relaxed">
                        {t.beds} bedroom{t.beds === 1 ? '' : 's'} · {t.baths} bath · approx. {fmt(t.sf)} sq ft
                      </p>
                      <p className="font-sans text-xs font-light text-cream text-opacity-40 mt-3">
                        Shown on lot{lots.length === 1 ? '' : 's'} {lots.join(', ')}
                      </p>
                    </div>
                  </ScrollReveal>
                )
              })}
          </div>
          <ScrollReveal delay={0.3}>
            <p className="font-sans text-xs font-light text-cream text-opacity-40 mt-10 leading-relaxed max-w-2xl">
              The floor plans shown are Hygge Bowen concept plans. Sizes are approximate and may change. Which plan sits on which lot is a working proposal, not a commitment.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl italic mb-6">Pick a lot you keep coming back to. Then come and stand on it.</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <Link to="/connect" className="btn px-9 py-3.5 inline-block">Request a Site Visit</Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
