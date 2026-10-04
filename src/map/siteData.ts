// Data types and loader for the Hygge Bowen 3D site map.
// Coordinates are model metres: x = east, y = north (UTM 10N minus the site origin), z = elevation in metres.

export type XY = [number, number]

export interface GridMeta {
  x0: number
  y0: number
  d: number
  nx: number
  ny: number
  zmin: number
  scale: number
  nodata?: number
  file: string
}

export interface Lot {
  lot: number
  use: string
  area_m2: number
  centroid: XY
  ring: XY[]
}

export interface HomeType {
  name: string
  sf: number
  published_sf: number
  beds: number
  baths: string
  storeys: number
  shape: string | null
  footprint_m: [number, number] | null
  overall_ft: [number, number] | null
}

export interface Home {
  type: string
  drawn_as: string
  bearing: number | null
  ring: XY[]
  src: string
}

export interface Building {
  lot: number | null
  kind: string
  name: string | null
  ring: XY[]
  z: number | null
  bearing: number | null
  footprint_m: [number, number] | null
}

export interface Polyline {
  closed: boolean
  xy: XY[]
}

export interface SiteData {
  meta: Record<string, string | number | number[]>
  terrain: GridMeta
  context: GridMeta
  parcel: { ring: XY[]; area_ha: number; pid: string }
  lots: Lot[]
  common: { label: string; ring: XY[] }[]
  road: { alignments: XY[][]; edges: XY[][]; driveways: XY[][]; pads: XY[][]; surface: string }
  existing_roads: { cl: XY[] }[]
  context_roads: { name: string; highway: string | null; xy: XY[] }[]
  buildings: Building[]
  home_types: Record<string, HomeType>
  homes: Record<string, Home>
  lot_geometry: Record<string, { house_ring: XY[]; driveway: XY[] }>
  water: Record<'creek' | 'pond' | 'wetland' | 'wetland_buffer', Polyline[]>
  trees: [number, number, number, number, number][] // x, y, ground z, height, crown radius
  containers: { id: string; x: number; y: number; bearing: number; size: number[]; z: number }[]
  park: { name: string; lat: number; lon: number; z: number; xy: XY }
  zoning: { zone: string; cottages_max: number; occupancy: string; product_rule: string }
}

/** A regular height grid with bilinear sampling. Rows run south to north. */
export class Heightfield {
  readonly meta: GridMeta
  readonly data: Uint16Array

  constructor(meta: GridMeta, data: Uint16Array) {
    this.meta = meta
    this.data = data
  }

  private raw(i: number, j: number): number | null {
    const { nx, ny, nodata, zmin, scale } = this.meta
    if (i < 0 || j < 0 || i >= nx || j >= ny) return null
    const v = this.data[j * nx + i]
    if (nodata !== undefined) {
      if (v === nodata) return null
      return zmin + (v - 1) * scale
    }
    return zmin + v * scale
  }

  /** Height at a model (x, y), or null outside the grid / in a no-data hole. */
  z(x: number, y: number): number | null {
    const { x0, y0, d } = this.meta
    const fx = (x - x0) / d
    const fy = (y - y0) / d
    const i = Math.floor(fx)
    const j = Math.floor(fy)
    const tx = fx - i
    const ty = fy - j
    const z00 = this.raw(i, j)
    const z10 = this.raw(i + 1, j)
    const z01 = this.raw(i, j + 1)
    const z11 = this.raw(i + 1, j + 1)
    if (z00 === null || z10 === null || z01 === null || z11 === null) {
      return z00 ?? z10 ?? z01 ?? z11
    }
    return (z00 * (1 - tx) + z10 * tx) * (1 - ty) + (z01 * (1 - tx) + z11 * tx) * ty
  }

  /** Height at (x, y), falling back to a default where the grid has nothing. */
  zOr(x: number, y: number, fallback: number): number {
    const v = this.z(x, y)
    return v === null ? fallback : v
  }
}

export interface LoadedSite {
  data: SiteData
  terrain: Heightfield
  context: Heightfield
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

async function fetchGrid(meta: GridMeta): Promise<Heightfield> {
  const res = await fetch(`${BASE}/data/${meta.file}`)
  if (!res.ok) throw new Error(`Could not load ${meta.file}`)
  const buf = await res.arrayBuffer()
  return new Heightfield(meta, new Uint16Array(buf))
}

let cache: Promise<LoadedSite> | null = null

export function loadSiteData(): Promise<LoadedSite> {
  if (!cache) {
    cache = (async () => {
      const res = await fetch(`${BASE}/data/hygge-site.json`)
      if (!res.ok) throw new Error('Could not load the site data')
      const data = (await res.json()) as SiteData
      const [terrain, context] = await Promise.all([fetchGrid(data.terrain), fetchGrid(data.context)])
      return { data, terrain, context }
    })()
    cache.catch(() => {
      cache = null
    })
  }
  return cache
}

/** Ray-casting point-in-polygon test. */
export function pointInRing(x: number, y: number, ring: XY[]): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

export function ringBounds(ring: XY[]): [number, number, number, number] {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const [x, y] of ring) {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
  return [minX, minY, maxX, maxY]
}

export function ringCentroid(ring: XY[]): XY {
  let sx = 0
  let sy = 0
  for (const [x, y] of ring) {
    sx += x
    sy += y
  }
  return [sx / ring.length, sy / ring.length]
}

export const SQFT_PER_M2 = 10.7639

/** Lot facts in the words the website is allowed to use. */
export function describeUse(use: string): string {
  if (use === 'cottage') return 'Cottage lot'
  if (use.startsWith('caretaker')) return 'Caretaker residence'
  if (use.startsWith('commercial')) return 'The Barn (common house & café)'
  return use
}
