import input from '../input/day19'

// Day 19: Tractor Beam
// 1.
// 2.

const enumerate = function*(iterable) {
  for (let i = 0; i < iterable.length; i += 1) yield [i, iterable[i]]
}

const unblock = () => new Promise(setImmediate)

// const next = async arr => {
//   while (true) {
//     if (arr.length > 0) return arr.shift()
//     else await unblock()
//   }
// }
const next = async (arr, id) => {
  let t = 0
  while (true) {
    t += 1
    if (arr.length > 0) return arr.shift()
    else await unblock()
    if (t === 10000) console.log('WAITING', id ?? '')
  }
}

const Mapper = size => (id, src, trg) => async () => {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ' ')
  )

  for (let [i, row] of enumerate(grid))
    for (let [j] of enumerate(row)) {
      console.log([i, j], src, trg)
      trg.push(j)
      trg.push(i)
      const reply = await next(src, id)
      grid[i][j] = reply
    }

  trg.push('END', grid)
}

const Wrapper = builder => (id, src, trg) => async() => {
  const machine = builder(id, src, trg)
  while (true) {
    
  }
}

import Intcode from '../intcode'

const buildMachine = Intcode(input)
const buildMapper = Mapper(50)

const main = async () => {
  const io = { A: [], B: [] }

  const drone = buildMachine('D', io.A, io.B)
  const map = buildMapper('M', io.B, io.A)

  await Promise.all([map(), drone()])

  console.log(io)
}

main()
