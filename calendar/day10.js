import input from '../input/day10'

// Day 10: Monitoring Station
// 1.
// 2.

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
  objMap.set(src, [])

  const blocked = new Set()

  objSet.forEach(trg => {
    if (trg === src) return

    const [ti, tj] = trg.split(',').map(s => +s)

    const [rise, run] = slope(si, sj, ti, tj)
    if (blocked.has(`${rise},${run}`)) return

    for (let [pi, pj] of inLine(si, sj, ti, tj)) {
      const pnt = `${pi},${pj}`

      if (objSet.has(pnt)) {
        objMap.set(src, [...objMap.get(src), pnt])
        blocked.add(`${rise},${run}`)
        return
      }
    }
  })
})

// console.log(objMap)

// 43 x 43
const disp = (src, arr) =>
  Array.from({ length: 43 }, (_, i) =>
    Array.from({ length: 43 }, (_, j) =>
      `${i},${j}` === src ? '*' : arr.includes(`${i},${j}`) ? '#' : '.'
    ).join('')
  ).join('\n')

console.log([...objMap.keys()])
console.log(objMap.get('0,4'))
console.log(disp('0,4', objMap.get('0,4')))

