// Rebuilds public/data from the compressed text sources in data-src/ (keeps the repo free of binaries).
// hygge-site.json: gzip+base64. terrain/context: row-wise int16 deltas of the uint16 LE grid, gzip+base64.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'

const src = 'data-src'
const out = 'public/data'
mkdirSync(out, { recursive: true })

const read = (name) => gunzipSync(Buffer.from(readFileSync(`${src}/${name}`, 'utf8').trim(), 'base64'))

const site = JSON.parse(read('hygge-site.json.gz.b64').toString('utf8'))
writeFileSync(`${out}/hygge-site.json`, JSON.stringify(site))

for (const key of ['terrain', 'context']) {
  const meta = site[key]
  const delta = read(`${key}.delta.gz.b64`)
  const n = meta.nx * meta.ny
  if (delta.length !== n * 2) throw new Error(`${key}: expected ${n} values, got ${delta.length / 2}`)
  const grid = Buffer.alloc(n * 2)
  for (let j = 0; j < meta.ny; j++) {
    let acc = 0
    for (let i = 0; i < meta.nx; i++) {
      const k = j * meta.nx + i
      const v = delta.readInt16LE(k * 2)
      acc = i === 0 ? v : acc + v
      if (acc < 0 || acc > 65535) throw new Error(`${key}: value out of range at ${k}`)
      grid.writeUInt16LE(acc, k * 2)
    }
  }
  writeFileSync(`${out}/${meta.file}`, grid)
}
console.log(`unpacked ${existsSync(`${out}/terrain.bin`) ? 'terrain, context and site data' : 'nothing'} into ${out}`)
