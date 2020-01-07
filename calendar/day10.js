import input from '../input/day10'

// Day 10: Monitoring Station
// 1. 344
// 2. 2732

const buildSet = str =>
  str
    .split('\n')
    .reduce(
      (set, row, i) =>
        row
          .split('')
          .reduce((s, v, j) => (v === '#' ? s.add(`${i},${j}`, v) : s), set),
      new Set()
    )

const gdc = (a, b) => (b ? gdc(b, a % b) : a)

const slope = (si, sj, ti, tj) => {
  const d = Math.abs(gdc(ti - si, tj - sj))
  return [(ti - si) / d, (tj - sj) / d]
}

const inLine = function*(si, sj, ti, tj) {
  const [di, dj] = slope(si, sj, ti, tj)

  let [pi, pj] = [si, sj]
  while (pi !== ti || pj !== tj) {
    pi += di
    pj += dj
    yield [pi, pj]
  }
}

const objSet = buildSet(input)
const objMap = new Map()

objSet.forEach(src => {
  const [si, sj] = src.split(',').map(s => +s)
  objMap.set(src, 0)

  const blocked = new Set()

  objSet.forEach(trg => {
    if (trg === src) return

    const [ti, tj] = trg.split(',').map(s => +s)

    const [rise, run] = slope(si, sj, ti, tj)
    if (blocked.has(`${rise},${run}`)) return

    for (let [pi, pj] of inLine(si, sj, ti, tj)) {
      const pnt = `${pi},${pj}`

      if (objSet.has(pnt)) {
        objMap.set(src, objMap.get(src) + 1)
        blocked.add(`${rise},${run}`)
        return
      }
    }
  })
})

console.log(Math.max(...objMap.values()))

// [34, 30]

const relative = (si, sj) => (ti, tj) => [ti - si, tj - sj]

const crtToPol = (y, x) => ({
  crt: [y, x],
  rad: Math.atan2(y, x),
  dst: Math.hypot(y, x),
  agl: ((Math.atan2(y, x) * 180) / Math.PI + 450) % 360,
})

console.log(crtToPol(...relative(34, 30)(33, 30)))
console.log(crtToPol(...relative(34, 30)(35, 30)))

const station = '34,30'
const src = [34, 30]

// const station = '13,11'
// const src = [13, 11]

const rel = relative(...src)
const radMap = {}

objSet.forEach(trg => {
  if (trg === station) return
  const polar = crtToPol(...rel(...trg.split(',').map(s => +s)))
  radMap[trg] = polar
})

const radArr = Object.entries(radMap).map(([trg, { crt, rad, dst, agl }]) => ({
  abs: trg.split(',').map(s => +s),
  rel: crt,
  rad: rad < 0 ? Math.PI + rad : rad,
  dst,
  agl,
}))

const sortedRadArr = radArr
  .sort(({ dst: a }, { dst: b }) => a - b)
  .sort(({ agl: a }, { agl: b }) => a - b)

const stackedRadArr = sortedRadArr.reduce(
  ({ c, arr }, o) => {
    const { rad } = o
    if (rad === c) arr[arr.length - 1].push(o)
    else arr.push([o])
    return { c: rad, arr }
  },
  { arr: [] }
).arr

let order = []

while (stackedRadArr.length > 0) {
  const nextArr = stackedRadArr.shift()
  const nextObj = nextArr.shift()
  order.push(nextObj)
  if (nextArr.length > 0) stackedRadArr.push(nextArr)
}

console.log(order[199])
