import input from '../input/day14'

// Day 14: Space Stoichiometry
// 1. 399063
// 2. 4215654

const parseReaction = str => {
  const [s, t] = str.split('=>')
  const sources = s
    .trim()
    .split(',')
    .map(v => v.trim().split(' '))
    .reduce((a, [qty, id]) => [...a, { id, qty: +qty }], [])
  const target = t.trim().split(' ')
  return {
    src: sources,
    trg: { id: target[1], qty: +target[0] },
  }
}

const buildMap = arr =>
  arr.reduce(
    (m, { src, trg }) => ({
      ...m,
      [trg.id]: {
        quantity: trg.qty,
        sources: src,
      },
    }),
    {}
  )

const map = buildMap(input.split('\n').map(parseReaction))

// console.log(map)

const surplus = {
  // ORE: 1000000000000
}

const getCosts = map => (id, needed = 1) => {
  const onhand = surplus[id] ?? 0
  const diff = onhand - needed

  if (diff >= 0) {
    surplus[id] = diff
    return 0
  }

  const short = Math.abs(diff)

  const { sources, quantity } = map[id]
  const mul = Math.ceil(short / quantity)

  const makes = quantity * mul
  surplus[id] = makes - short

  return sources.reduce(
    (a, { id, qty }) =>
      a + (id === 'ORE' ? mul * qty : getCosts(map)(id, mul * qty)),
    0
  )
}

let total = 0
let count = 0

while (total < 1000000000000) {
  const step = getCosts(map)('FUEL', 1)
  total += step

  count += 1
  if (count % 100000 === 0)
    console.log('|' + `${total}`.padStart(13, ' '), `${step}`.padStart(13, ' '))
}

console.log(count)
