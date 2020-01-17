import input from '../input/day19'

// Day 19: Tractor Beam
// 1. 201
// 2. 6610984

const enumerate = function*(iterable) {
  for (let i = 0; i < iterable.length; i += 1) yield [i, iterable[i]]
}

const count = function*(start = 0) {
  let n = start
  while (true) yield n++
}

const unblock = () => new Promise(setImmediate)

const next = async arr => {
  while (true) {
    if (arr.length > 0) return arr.shift()
    else await unblock()
  }
}

const flush = async arr => {
  while (arr.length > 0) arr.shift()
}

const memoize = fn => {
  const cache = {}
  return new Proxy(fn, {
    apply(target, thisArg, argsList) {
      const key = [target.name, ...argsList].toString()
      if (!(key in cache)) cache[key] = Reflect.apply(target, thisArg, argsList)
      return cache[key]
    },
  })
}

const Check = builder => id => {
  const io = { A: [], B: [] }
  const machine = builder(id, io.A, io.B)

  return async (x, y) => {
    await flush(io.B)
    io.A.push(x, y)
    machine()
    return next(io.B)
  }
}

import Intcode from '../intcode'

const buildMachine = Intcode(input)

const main = async (size = 50) => {
  const check = Check(buildMachine)('D')

  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ' ')
  )

  for (let [i, row] of enumerate(grid))
    for (let [j] of enumerate(row)) {
      const response = await check(j, i)
      grid[i][j] = response
    }

  const str = grid.map(r => r.join('')).join('\n')

  console.log(str)
  console.log([...str.matchAll(/1/g)].length)
}

// main()

const checkColumn = () => {
  const check = Check(buildMachine)('D')
  return async x => {
    let top
    for (top of count()) {
      const response = await check(x, top)
      if (response === 1) break
    }

    if ((await check(x, top + 100)) === 0) return [0, 0]

    let bottom
    for (bottom of count(top + 100 + 1)) {
      const response = await check(x, bottom)
      if (response === 0) break
    }

    const y = bottom - 100

    let width
    for (width of count(1)) {
      const response = await check(x + width, y)
      if (response === 0) break
    }

    return [y, width]
  }
}

const binSearch = async (l = 0, h = 10000) => {
  const check = checkColumn()

  let lo = l
  let hi = h
  let best

  while (hi - lo > 1) {
    const x = Math.floor((lo + hi) / 2)
    const [y, width] = await check(x)
    console.log(x, lo, hi, best)
    if (width >= 100) {
      hi = x
      best = [x, y]
    } else if (width < 100) {
      lo = x
    }
  }

  return best
}

const main2 = async () => {
  const result = await binSearch()
  console.log(result)
}

main2()
