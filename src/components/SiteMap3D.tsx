import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Line, OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import {
  Heightfield,
  LoadedSite,
  XY,
  loadSiteData,
  pointInRing,
  ringBounds,
  ringCentroid,
} from '../map/siteData'

// ---------------------------------------------------------------------------
// Coordinate convention
// Everything is built in site metres (x east, y north, z up) inside a group
// rotated -90° about X, which turns (x, y, z) into three.js (x, z, -y).
// Camera positions are therefore written as [x, z, -y].
// ---------------------------------------------------------------------------

const toThree = (x: number, y: number, z: number): [number, number, number] => [x, z, -y]

import type { Vantage } from '../map/vantages'

interface Pose {
  position: THREE.Vector3
  target: THREE.Vector3
}

function poseFor(v: Vantage, hf: Heightfield, ctx: Heightfield): Pose {
  const z = (x: number, y: number, lift: number) => hf.zOr(x, y, ctx.zOr(x, y, 100)) + lift
  switch (v) {
    case 'road':
      return {
        position: new THREE.Vector3(...toThree(-70, -70, z(-70, -70, 6))),
        target: new THREE.Vector3(...toThree(90, 110, z(90, 110, 2))),
      }
    case 'playground':
      return {
        position: new THREE.Vector3(...toThree(-300, -150, z(-300, -150, 4))),
        target: new THREE.Vector3(...toThree(10, 40, z(10, 40, 4))),
      }
    case 'plan':
      return {
        position: new THREE.Vector3(...toThree(90, 100, 620)),
        target: new THREE.Vector3(...toThree(90, 101, 100)),
      }
    default:
      return {
        position: new THREE.Vector3(...toThree(40, -230, 330)),
        target: new THREE.Vector3(...toThree(80, 110, 100)),
      }
  }
}

// Palette (site colours + muted Pacific-coast tones)
const C = {
  forestLow: new THREE.Color('#1c3320'),
  forestHigh: new THREE.Color('#3a5a34'),
  context: new THREE.Color('#1a2a1c'),
  lot: new THREE.Color('#8f9a6a'),
  caretaker: new THREE.Color('#9a9270'),
  barn: new THREE.Color('#a08a68'),
  road: new THREE.Color('#8d867a'),
  water: new THREE.Color('#3f6f8c'),
  wetland: new THREE.Color('#4e6e55'),
  selected: new THREE.Color('#d4885a'),
  outline: '#f0ebe3',
  rust: '#c4572a',
  cedar: '#b07a48',
  charcoal: '#2e2c2a',
  roof: '#232323',
  trunk: '#4a3a2a',
}

/** Densify a ring/polyline and drape it on the terrain. */
function drape(points: XY[], hf: Heightfield, fallback: Heightfield, lift: number, close = false, maxSeg = 4): [number, number, number][] {
  const pts = close ? [...points, points[0]] : points
  const out: [number, number, number][] = []
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i]
    if (i > 0) {
      const [px, py] = pts[i - 1]
      const len = Math.hypot(x - px, y - py)
      const n = Math.floor(len / maxSeg)
      for (let k = 1; k < n; k++) {
        const t = k / n
        const sx = px + (x - px) * t
        const sy = py + (y - py) * t
        out.push(toThree(sx, sy, hf.zOr(sx, sy, fallback.zOr(sx, sy, 90)) + lift))
      }
    }
    out.push(toThree(x, y, hf.zOr(x, y, fallback.zOr(x, y, 90)) + lift))
  }
  return out
}

interface Classified {
  lotOf: Int16Array // lot number per vertex, 0 if none
  road: Uint8Array
  water: Uint8Array
  wetland: Uint8Array
  inParcel: Uint8Array
}

function classify(site: LoadedSite): Classified {
  const { data, terrain } = site
  const { nx, ny, x0, y0, d } = terrain.meta
  const n = nx * ny
  const lotOf = new Int16Array(n)
  const road = new Uint8Array(n)
  const water = new Uint8Array(n)
  const wetland = new Uint8Array(n)
  const inParcel = new Uint8Array(n)
  const mark = (ring: XY[], fn: (idx: number) => void) => {
    const [minX, minY, maxX, maxY] = ringBounds(ring)
    const i0 = Math.max(0, Math.floor((minX - x0) / d))
    const i1 = Math.min(nx - 1, Math.ceil((maxX - x0) / d))
    const j0 = Math.max(0, Math.floor((minY - y0) / d))
    const j1 = Math.min(ny - 1, Math.ceil((maxY - y0) / d))
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        if (pointInRing(x0 + i * d, y0 + j * d, ring)) fn(j * nx + i)
      }
    }
  }
  mark(data.parcel.ring, (k) => (inParcel[k] = 1))
  for (const lot of data.lots) mark(lot.ring, (k) => (lotOf[k] = lot.lot))
  for (const w of data.water.wetland) if (w.closed) mark(w.xy, (k) => (wetland[k] = 1))
  for (const p of data.water.pond) if (p.closed) mark(p.xy, (k) => (water[k] = 1))
  for (const e of data.road.edges) mark(e, (k) => (road[k] = 1))
  for (const p of data.road.pads) mark(p, (k) => (road[k] = 1))
  for (const dw of data.road.driveways) mark(dw, (k) => (road[k] = 1))
  return { lotOf, road, water, wetland, inParcel }
}

function Terrain({ site, cls, selected, onPick }: { site: LoadedSite; cls: Classified; selected: number | null; onPick: (lot: number | null) => void }) {
  const { terrain, data } = site
  const { nx, ny, x0, y0, d, zmin: zMin } = terrain.meta
  const zMax = useMemo(() => {
    let m = -Infinity
    for (let k = 0; k < terrain.data.length; k++) m = Math.max(m, terrain.data[k])
    return zMin + m * terrain.meta.scale
  }, [terrain, zMin])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(nx * ny * 3)
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const k = j * nx + i
        pos[k * 3] = x0 + i * d
        pos[k * 3 + 1] = y0 + j * d
        pos[k * 3 + 2] = terrain.zOr(x0 + i * d, y0 + j * d, zMin)
      }
    }
    const idx = new Uint32Array((nx - 1) * (ny - 1) * 6)
    let p = 0
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const a = j * nx + i
        const b = a + 1
        const c = a + nx
        const e = c + 1
        idx[p++] = a; idx[p++] = b; idx[p++] = e
        idx[p++] = a; idx[p++] = e; idx[p++] = c
      }
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setIndex(new THREE.BufferAttribute(idx, 1))
    g.computeVertexNormals()
    return g
  }, [nx, ny, x0, y0, d, terrain, zMin])

  // Vertex colours: forest by height, lots as clearings, roads gravel, water and wetland.
  const colors = useMemo(() => {
    const col = new Float32Array(nx * ny * 3)
    const tmp = new THREE.Color()
    const useOf = new Map<number, string>()
    for (const l of data.lots) useOf.set(l.lot, l.use)
    for (let k = 0; k < nx * ny; k++) {
      const vx = x0 + (k % nx) * d
      const vy = y0 + Math.floor(k / nx) * d
      const z = terrain.zOr(vx, vy, zMin)
      const t = THREE.MathUtils.clamp((z - zMin) / Math.max(1, zMax - zMin), 0, 1)
      tmp.copy(C.forestLow).lerp(C.forestHigh, t)
      if (!cls.inParcel[k]) tmp.lerp(C.context, 0.7)
      const lot = cls.lotOf[k]
      if (lot) {
        const use = useOf.get(lot) ?? 'cottage'
        const base = use === 'cottage' ? C.lot : use.startsWith('caretaker') ? C.caretaker : C.barn
        tmp.lerp(base, 0.75)
        if (lot === selected) tmp.lerp(C.selected, 0.55)
      }
      if (cls.wetland[k]) tmp.lerp(C.wetland, 0.6)
      if (cls.water[k]) tmp.copy(C.water)
      if (cls.road[k]) tmp.copy(C.road)
      col[k * 3] = tmp.r
      col[k * 3 + 1] = tmp.g
      col[k * 3 + 2] = tmp.b
    }
    return col
  }, [cls, selected, data.lots, nx, ny, x0, y0, d, terrain, zMin, zMax])

  useEffect(() => {
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.attributes.color.needsUpdate = true
  }, [geometry, colors])

  return (
    <mesh
      geometry={geometry}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation()
        const p = e.point.clone()
        // back to site coords: three (x, z, -y)
        const x = p.x
        const y = -p.z
        const hit = data.lots.find((l) => pointInRing(x, y, l.ring))
        onPick(hit ? hit.lot : null)
      }}
    >
      <meshStandardMaterial vertexColors roughness={0.95} metalness={0} flatShading={false} />
    </mesh>
  )
}

function ContextTerrain({ site }: { site: LoadedSite }) {
  const { context, data } = site
  const geometry = useMemo(() => {
    const { nx, ny, x0, y0, d, zmin: zMin } = context.meta
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(nx * ny * 3)
    const ok = new Uint8Array(nx * ny)
    const parcel = data.parcel.ring
    const [pminX, pminY, pmaxX, pmaxY] = ringBounds(parcel)
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const k = j * nx + i
        const x = x0 + i * d
        const y = y0 + j * d
        const z = context.z(x, y)
        pos[k * 3] = x
        pos[k * 3 + 1] = y
        pos[k * 3 + 2] = z === null ? zMin : z - 0.6 // sits just under the detailed terrain
        // keep the context away from the detailed parcel grid to avoid z-fighting
        const insideParcelBox = x > pminX - 6 && x < pmaxX + 6 && y > pminY - 6 && y < pmaxY + 6
        ok[k] = z === null || insideParcelBox ? 0 : 1
      }
    }
    const idx: number[] = []
    for (let j = 0; j < ny - 1; j++) {
      for (let i = 0; i < nx - 1; i++) {
        const a = j * nx + i
        const b = a + 1
        const c = a + nx
        const e = c + 1
        if (ok[a] && ok[b] && ok[e]) idx.push(a, b, e)
        if (ok[a] && ok[e] && ok[c]) idx.push(a, e, c)
      }
    }
    // fade to the page background with distance from the site so the LiDAR boundary never shows
    const col = new Float32Array(nx * ny * 3)
    const bg = new THREE.Color('#080c08')
    const tmp = new THREE.Color()
    const cx = (pminX + pmaxX) / 2
    const cy = (pminY + pmaxY) / 2
    for (let k = 0; k < nx * ny; k++) {
      const r = Math.hypot(pos[k * 3] - cx, pos[k * 3 + 1] - cy)
      const t = THREE.MathUtils.clamp((r - 350) / 400, 0, 1)
      tmp.copy(C.context).lerp(bg, t)
      col[k * 3] = tmp.r
      col[k * 3 + 1] = tmp.g
      col[k * 3 + 2] = tmp.b
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
  }, [context, data.parcel.ring])
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  )
}

/** A closed polygon triangulated and draped on the terrain, used for road surfaces. */
function DrapedFill({ ring, site, color, lift }: { ring: XY[]; site: LoadedSite; color: THREE.Color; lift: number }) {
  const { terrain, context } = site
  const geometry = useMemo(() => {
    const pts = ring.map(([x, y]) => new THREE.Vector2(x, y))
    if (pts.length > 2 && pts[0].distanceTo(pts[pts.length - 1]) < 0.01) pts.pop()
    const shape = new THREE.Shape(pts)
    const g = new THREE.ShapeGeometry(shape)
    const pos = g.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, terrain.zOr(x, y, context.zOr(x, y, 90)) + lift)
    }
    pos.needsUpdate = true
    g.computeVertexNormals()
    return g
  }, [ring, terrain, context, lift])
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color={color} roughness={1} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} side={THREE.DoubleSide} />
    </mesh>
  )
}

/** A ribbon of constant width along a centreline, draped on the terrain. */
function Ribbon({ line, width, site, color, lift }: { line: XY[]; width: number; site: LoadedSite; color: THREE.Color; lift: number }) {
  const { terrain, context } = site
  const geometry = useMemo(() => {
    const pts = drape(line, terrain, context, lift, false, 3).map(([x, y, z]) => new THREE.Vector3(x, -z, y)) // back to site coords
    const left: THREE.Vector3[] = []
    const right: THREE.Vector3[] = []
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)]
      const b = pts[Math.min(pts.length - 1, i + 1)]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const len = Math.hypot(dx, dy) || 1
      const nx = (-dy / len) * (width / 2)
      const ny = (dx / len) * (width / 2)
      const p = pts[i]
      left.push(new THREE.Vector3(p.x + nx, p.y + ny, terrain.zOr(p.x + nx, p.y + ny, context.zOr(p.x + nx, p.y + ny, 90)) + lift))
      right.push(new THREE.Vector3(p.x - nx, p.y - ny, terrain.zOr(p.x - nx, p.y - ny, context.zOr(p.x - nx, p.y - ny, 90)) + lift))
    }
    const pos: number[] = []
    for (let i = 0; i < pts.length - 1; i++) {
      const l0 = left[i], r0 = right[i], l1 = left[i + 1], r1 = right[i + 1]
      pos.push(l0.x, l0.y, l0.z, r0.x, r0.y, r0.z, l1.x, l1.y, l1.z)
      pos.push(r0.x, r0.y, r0.z, r1.x, r1.y, r1.z, l1.x, l1.y, l1.z)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.computeVertexNormals()
    return g
  }, [line, width, terrain, context, lift])
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color={color} roughness={1} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} side={THREE.DoubleSide} />
    </mesh>
  )
}

function RoadFills({ site }: { site: LoadedSite }) {
  const { data } = site
  return (
    <group>
      {data.road.alignments.map((a, i) => <Ribbon key={`a${i}`} line={a} width={6} site={site} color={C.road} lift={0.3} />)}
      {data.road.edges.map((r, i) => <DrapedFill key={`e${i}`} ring={r} site={site} color={C.road} lift={0.25} />)}
      {data.road.pads.map((r, i) => <DrapedFill key={`p${i}`} ring={r} site={site} color={C.road} lift={0.25} />)}
      {data.road.driveways.map((r, i) => <DrapedFill key={`d${i}`} ring={r} site={site} color={C.road} lift={0.2} />)}
    </group>
  )
}

function Outlines({ site, selected }: { site: LoadedSite; selected: number | null }) {
  const { data, terrain, context } = site
  const lots = useMemo(() => data.lots.map((l) => ({ lot: l.lot, pts: drape(l.ring, terrain, context, 0.5, true) })), [data.lots, terrain, context])
  const parcel = useMemo(() => drape(data.parcel.ring, terrain, context, 0.6, true), [data.parcel.ring, terrain, context])
  const roads = useMemo(() => data.road.edges.map((e) => drape(e, terrain, context, 0.45, true)), [data.road.edges, terrain, context])
  const pads = useMemo(() => data.road.pads.map((e) => drape(e, terrain, context, 0.45, true)), [data.road.pads, terrain, context])
  const drives = useMemo(() => data.road.driveways.map((e) => drape(e, terrain, context, 0.45, true)), [data.road.driveways, terrain, context])
  const creek = useMemo(() => data.water.creek.map((c) => drape(c.xy, terrain, context, 0.5, c.closed)), [data.water.creek, terrain, context])
  const pond = useMemo(() => data.water.pond.map((c) => drape(c.xy, terrain, context, 0.5, c.closed)), [data.water.pond, terrain, context])
  const ctxRoads = useMemo(
    () =>
      data.context_roads
        .filter((r) => r.highway !== 'path' && r.highway !== 'construction')
        .map((r) => drape(r.xy, terrain, context, 0.8, false, 10)),
    [data.context_roads, terrain, context],
  )
  const ctxPaths = useMemo(
    () => data.context_roads.filter((r) => r.highway === 'path').map((r) => drape(r.xy, terrain, context, 0.8, false, 10)),
    [data.context_roads, terrain, context],
  )
  return (
    <group>
      <Line points={parcel} color={C.outline} lineWidth={1.5} transparent opacity={0.55} />
      {lots.map((l) => (
        <Line
          key={l.lot}
          points={l.pts}
          color={l.lot === selected ? C.rust : C.outline}
          lineWidth={l.lot === selected ? 2.5 : 1}
          transparent
          opacity={l.lot === selected ? 1 : 0.5}
        />
      ))}
      {roads.map((p, i) => <Line key={`r${i}`} points={p} color="#a39b8c" lineWidth={1.6} transparent opacity={0.7} />)}
      {pads.map((p, i) => <Line key={`p${i}`} points={p} color="#c9c2b4" lineWidth={1} transparent opacity={0.5} />)}
      {drives.map((p, i) => <Line key={`d${i}`} points={p} color="#a39b8c" lineWidth={1.2} transparent opacity={0.6} />)}
      {creek.map((p, i) => <Line key={`c${i}`} points={p} color="#6fa7c7" lineWidth={1.2} transparent opacity={0.8} />)}
      {pond.map((p, i) => <Line key={`w${i}`} points={p} color="#6fa7c7" lineWidth={1.2} transparent opacity={0.8} />)}
      {ctxRoads.map((p, i) => <Line key={`x${i}`} points={p} color="#6f6a60" lineWidth={1.2} transparent opacity={0.4} />)}
      {ctxPaths.map((p, i) => <Line key={`y${i}`} points={p} color="#6f6a60" lineWidth={0.8} dashed dashSize={4} gapSize={3} transparent opacity={0.25} />)}
    </group>
  )
}

/** Rectangle / L / offset-bars footprint for a home type, centred and rotated. */
function footprintFromType(shape: string | null, size: [number, number] | null, centre: XY, bearingDeg: number): XY[] {
  const [L, W] = size ?? [15, 8]
  let local: XY[]
  if (shape === 'L') {
    const w = W * 0.55
    local = [[0, 0], [L, 0], [L, w], [w, w], [w, W], [0, W]]
  } else if (shape === 'offset-bars') {
    const w = W / 2
    const off = L * 0.2
    local = [[0, 0], [L - off, 0], [L - off, w], [L, w], [L, W], [off, W], [off, w], [0, w]]
  } else {
    local = [[0, 0], [L, 0], [L, W], [0, W]]
  }
  // centre the local shape, then rotate so local +x follows the compass bearing
  const [cx, cy] = ringCentroid(local)
  const b = THREE.MathUtils.degToRad(bearingDeg)
  const ux = Math.sin(b)
  const uy = Math.cos(b)
  return local.map(([x, y]) => {
    const lx = x - cx
    const ly = y - cy
    return [centre[0] + lx * ux - ly * uy, centre[1] + lx * uy + ly * ux]
  })
}

interface HomeSpec {
  lot: number
  ring: XY[]
  height: number
  wall: string
  label: string
}

function homesFor(site: LoadedSite): HomeSpec[] {
  const { data } = site
  const out: HomeSpec[] = []
  for (const [k, h] of Object.entries(data.homes)) {
    const lot = Number(k)
    let ring = h.ring
    if (h.type !== h.drawn_as) {
      const t = data.home_types[h.type]
      ring = footprintFromType(t?.shape ?? null, t?.footprint_m ?? null, ringCentroid(h.ring), h.bearing ?? 0)
    }
    out.push({ lot, ring, height: 3.2, wall: C.cedar, label: h.type })
  }
  for (const b of data.buildings) {
    if (b.kind === 'commercial_building' || b.kind === 'barn_common_house') {
      out.push({ lot: 16, ring: b.ring, height: b.kind === 'barn_common_house' ? 6 : 4.5, wall: C.charcoal, label: 'The Barn' })
    }
  }
  return out
}

function Home({ spec, site, selected, hovered, onPick, onHover }: { spec: HomeSpec; site: LoadedSite; selected: boolean; hovered: boolean; onPick: (lot: number) => void; onHover: (lot: number | null) => void }) {
  const { terrain, context } = site
  const [cx, cy] = ringCentroid(spec.ring)
  const groundZ = useMemo(() => {
    let lo = Infinity
    for (const [x, y] of spec.ring) lo = Math.min(lo, terrain.zOr(x, y, context.zOr(x, y, 90)))
    return lo
  }, [spec.ring, terrain, context])
  const walls = useMemo(() => {
    const s = new THREE.Shape(spec.ring.map(([x, y]) => new THREE.Vector2(x - cx, y - cy)))
    const g = new THREE.ExtrudeGeometry(s, { depth: spec.height, bevelEnabled: false })
    return g
  }, [spec.ring, spec.height, cx, cy])
  const roof = useMemo(() => {
    const s = new THREE.Shape(spec.ring.map(([x, y]) => new THREE.Vector2((x - cx) * 1.06, (y - cy) * 1.06)))
    return new THREE.ExtrudeGeometry(s, { depth: 0.35, bevelEnabled: false })
  }, [spec.ring, cx, cy])
  const z = groundZ - 0.4
  const wallColor = selected ? C.rust : hovered ? '#c9905c' : spec.wall
  return (
    <group position={[cx, cy, z]}>
      <mesh
        geometry={walls}
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onPick(spec.lot) }}
        onPointerOver={(e) => { e.stopPropagation(); onHover(spec.lot) }}
        onPointerOut={() => onHover(null)}
      >
        <meshStandardMaterial color={wallColor} roughness={0.8} />
      </mesh>
      <mesh geometry={roof} position={[0, 0, spec.height + 0.4]} castShadow>
        <meshStandardMaterial color={C.roof} roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  )
}

function Trees({ site, homes }: { site: LoadedSite; homes: HomeSpec[] }) {
  const { data, terrain, context } = site
  const crownRef = useRef<THREE.InstancedMesh>(null)
  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const items = useMemo(() => {
    const keep: [number, number, number, number, number][] = []
    const blockers = [...homes.map((h) => h.ring), ...data.road.edges, ...data.road.pads]
    outer: for (const t of data.trees) {
      const [x, y] = t
      for (const r of blockers) if (pointInRing(x, y, r)) continue outer
      keep.push(t)
    }
    return keep
  }, [data.trees, data.road.edges, data.road.pads, homes])

  useEffect(() => {
    const crown = crownRef.current
    const trunk = trunkRef.current
    if (!crown || !trunk) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)) // cone axis (y) -> z up
    const col = new THREE.Color()
    items.forEach((t, i) => {
      const [x, y, , hRaw, rRaw] = t
      const h = THREE.MathUtils.clamp(hRaw * 0.5, 4, 18)
      const r = THREE.MathUtils.clamp(rRaw * 0.75, 1.2, 4.5)
      const gz = terrain.zOr(x, y, context.zOr(x, y, 90))
      const trunkH = h * 0.25
      m.compose(new THREE.Vector3(x, y, gz + trunkH + (h - trunkH) / 2), q, new THREE.Vector3(r, h - trunkH, r))
      crown.setMatrixAt(i, m)
      const seed = ((x * 12.9898 + y * 78.233) % 1 + 1) % 1
      col.setHSL(0.3 + seed * 0.08, 0.3 + seed * 0.15, 0.14 + seed * 0.11)
      crown.setColorAt(i, col)
      m.compose(new THREE.Vector3(x, y, gz + trunkH / 2), q, new THREE.Vector3(r * 0.18, trunkH, r * 0.18))
      trunk.setMatrixAt(i, m)
    })
    crown.instanceMatrix.needsUpdate = true
    if (crown.instanceColor) crown.instanceColor.needsUpdate = true
    trunk.instanceMatrix.needsUpdate = true
  }, [items, terrain, context])

  return (
    <group>
      <instancedMesh ref={crownRef} args={[undefined, undefined, items.length]} castShadow receiveShadow>
        <coneGeometry args={[1, 1, 7]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, items.length]} castShadow>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color={C.trunk} roughness={1} />
      </instancedMesh>
    </group>
  )
}

function Labels({ site, selected, onPick, showContext }: { site: LoadedSite; selected: number | null; onPick: (lot: number) => void; showContext: boolean }) {
  const { data, terrain, context } = site
  const zAt = (x: number, y: number, lift: number) => terrain.zOr(x, y, context.zOr(x, y, 90)) + lift
  const roadLabel = (name: string): XY | null => {
    const ways = data.context_roads.filter((r) => r.name === name).sort((a, b) => b.xy.length - a.xy.length)
    if (!ways.length) return null
    const w = ways[0].xy
    return w[Math.floor(w.length / 2)]
  }
  const ctx: { text: string; xy: XY; lift: number }[] = []
  const ja = roadLabel('Joan Audrey Lane')
  if (ja) ctx.push({ text: 'Joan Audrey Lane', xy: ja, lift: 6 })
  const wj = roadLabel('Windjammer Road')
  if (wj) ctx.push({ text: 'Windjammer Road', xy: wj, lift: 6 })
  ctx.push({ text: data.park.name, xy: data.park.xy, lift: 8 })
  ctx.push({ text: 'Snug Cove · ferry →', xy: [330, 90], lift: 30 })
  return (
    <group>
      {data.lots.map((l) => {
        const [x, y] = l.centroid
        const isSel = l.lot === selected
        return (
          <Html key={l.lot} position={toThree(x, y, zAt(x, y, 7))} center distanceFactor={260} zIndexRange={[20, 0]} style={{ pointerEvents: 'auto' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onPick(l.lot) }}
              className={`site-map-badge ${isSel ? 'site-map-badge--active' : ''}`}
              aria-label={`Lot ${l.lot}`}
            >
              {l.lot}
            </button>
          </Html>
        )
      })}
      {showContext &&
        ctx.map((c) => (
          <Html key={c.text} position={toThree(c.xy[0], c.xy[1], zAt(c.xy[0], c.xy[1], c.lift))} center distanceFactor={220} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
            <span className="site-map-ctx">{c.text}</span>
          </Html>
        ))}
    </group>
  )
}

function CameraRig({ vantage, site, controls }: { vantage: Vantage; site: LoadedSite; controls: React.RefObject<OrbitControlsImpl> }) {
  const { camera } = useThree()
  const anim = useRef<{ from: Pose; to: Pose; t: number } | null>(null)
  const first = useRef(true)
  useEffect(() => {
    const to = poseFor(vantage, site.terrain, site.context)
    if (first.current) {
      first.current = false
      camera.position.copy(to.position)
      controls.current?.target.copy(to.target)
      controls.current?.update()
      return
    }
    anim.current = {
      from: { position: camera.position.clone(), target: controls.current ? controls.current.target.clone() : to.target.clone() },
      to,
      t: 0,
    }
  }, [vantage, site, camera, controls])
  useFrame((_, dt) => {
    const a = anim.current
    if (!a) return
    a.t = Math.min(1, a.t + dt / 1.4)
    const e = 1 - Math.pow(1 - a.t, 3)
    camera.position.lerpVectors(a.from.position, a.to.position, e)
    if (controls.current) {
      controls.current.target.lerpVectors(a.from.target, a.to.target, e)
      controls.current.update()
    }
    if (a.t >= 1) anim.current = null
  })
  return null
}

function Scene({ site, selected, onPick, vantage, shadows }: { site: LoadedSite; selected: number | null; onPick: (lot: number | null) => void; vantage: Vantage; shadows: boolean }) {
  const cls = useMemo(() => classify(site), [site])
  const homes = useMemo(() => homesFor(site), [site])
  const [hovered, setHovered] = useState<number | null>(null)
  const controls = useRef<OrbitControlsImpl>(null!)
  const target = poseFor('overview', site.terrain, site.context).target
  return (
    <>
      <color attach="background" args={['#080c08']} />
      <fog attach="fog" args={['#080c08', 320, 1050]} />
      <hemisphereLight args={['#cfe0f0', '#1a2a18', 0.55]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[-260, 420, 180]}
        intensity={1.5}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0006}
        shadow-camera-left={-400}
        shadow-camera-right={400}
        shadow-camera-top={400}
        shadow-camera-bottom={-400}
        shadow-camera-near={50}
        shadow-camera-far={1400}
      />
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <ContextTerrain site={site} />
        <Terrain site={site} cls={cls} selected={selected} onPick={onPick} />
        <RoadFills site={site} />
        <Outlines site={site} selected={selected} />
        <Trees site={site} homes={homes} />
        {homes.map((h, i) => (
          <Home key={`${h.lot}-${i}`} spec={h} site={site} selected={h.lot === selected} hovered={h.lot === hovered} onPick={onPick} onHover={setHovered} />
        ))}
        <Labels site={site} selected={selected} onPick={onPick} showContext={vantage !== 'road'} />
      </group>
      <OrbitControls
        ref={controls}
        target={target}
        enableDamping
        dampingFactor={0.08}
        minDistance={30}
        maxDistance={1100}
        maxPolarAngle={Math.PI / 2 - 0.04}
        makeDefault
      />
      <CameraRig vantage={vantage} site={site} controls={controls} />
    </>
  )
}

export interface SiteMap3DProps {
  selected: number | null
  onSelect: (lot: number | null) => void
  vantage: Vantage
  className?: string
}

export default function SiteMap3D({ selected, onSelect, vantage, className }: SiteMap3DProps) {
  const [site, setSite] = useState<LoadedSite | null>(null)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    loadSiteData().then(setSite).catch((e: Error) => setError(e.message))
  }, [])
  const shadows = typeof window !== 'undefined' ? window.innerWidth > 820 : true
  return (
    <div className={`relative w-full h-full ${className ?? ''}`}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center font-sans text-sm text-cream text-opacity-60">
          The map could not load. {error}
        </div>
      )}
      {!site && !error && (
        <div className="absolute inset-0 flex items-center justify-center font-serif italic text-xl text-cream text-opacity-60">
          Loading the land…
        </div>
      )}
      {site && (
        <Canvas
          shadows={shadows}
          dpr={[1, 1.5]}
          camera={{ fov: 42, near: 1, far: 4000, position: toThree(40, -230, 330) }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          onPointerMissed={() => onSelect(null)}
        >
          <Suspense fallback={null}>
            <Scene site={site} selected={selected} onPick={onSelect} vantage={vantage} shadows={shadows} />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}
