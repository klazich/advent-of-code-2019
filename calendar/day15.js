import input from '../input/day15'

// Day 15: Oxygen System
// 1. 204
// 2. 340

const unblock = () => new Promise(setImmediate)

const randElm = arr => arr[Math.floor(Math.random() * arr.length)]

const Grid = () => {
  const state = {}
  let max = [-Infinity, -Infinity]
  let min = [Infinity, Infinity]
  return {
    set: (x, y, v) => {
      state[y] = state[y] ?? {}
      state[y][x] = v
      if (x > max[0]) max[0] = x
      if (y > max[1]) max[1] = y
      if (x < min[0]) min[0] = x
      if (y < min[1]) min[1] = y
    },
    get: (x, y) => state?.[y]?.[x] ?? '█',
    visited: (x, y) => typeof state?.[y]?.[x] === 'string',
    extremes: () => [min, max],
    state: () => state,
    arr: () =>
      Array.from({ length: max[1] - min[1] + 1 }, (_, i) =>
        Array.from({ length: max[0] - min[0] + 1 }, (_, j) => {
          const x = min[0] + j
          const y = max[1] - i
          return state?.[y]?.[x] ?? '█'
        })
      ),
  }
}

const draw = (grid, path) => pos => {
  const [min, max] = grid.extremes()
  const arr = grid.arr()
  if (path) {
    let pre = 0
    let last
    for (let [v, [x, y]] of path) {
      let next = {
        0: { 1: '╵', 2: '╷', 3: '╴', 4: '╶' },
        1: { 1: '│', 3: '╮', 4: '╭' },
        2: { 2: '│', 3: '╯', 4: '╰' },
        3: { 1: '╰', 2: '╭', 3: '─' },
        4: { 1: '╯', 2: '╮', 4: '─' },
      }[pre][v]
      if (pre !== 0) arr[max[1] - last[1]][last[0] - min[0]] = next
      pre = v
      last = [x, y]
    }
  }
  if (pos) {
    const [x, y] = pos
    arr[max[1] - y][x - min[0]] = '♀'
  }

  return arr.map(a => a.join('')).join('\n')
}

const rel = ([x, y]) => n =>
  ({
    1: [x, y + 1],
    2: [x, y - 1],
    3: [x - 1, y],
    4: [x + 1, y],
  }[n])

const avl = grid => pos =>
  [1, 2, 3, 4].filter(v => !grid.visited(...rel(pos)(v)))

const can = grid => pos =>
  [1, 2, 3, 4].filter(v => grid.get(...rel(pos)(v)) !== '▓')

const Mapper = (grid = Grid()) => (id, src, trg) => async () => {
  // async function*(path = []) {
  let pos = [0, 0]
  const path = []
  let back = false
  let o2

  let test = 1

  trg.push(test)

  grid.set(...pos, 'S')

  while (true) {
    const input = []

    while (input.length < 1) {
      if (src.length > 0) input.push(src.shift())
      else await unblock()
    }

    const [result] = input

    grid.set(...rel(pos)(test), { 0: '▓', 1: ' ', 2: 'O' }[result]) // ▓▒░

    if (result === 1 || result === 2) {
      pos = rel(pos)(test)
      if (!back) path.push([test, pos])
      back = false
    }

    if (result === 2) o2 = pos

    const newAvailable = avl(grid)(pos)

    if (newAvailable.length < 1) {
      test = { 1: 2, 2: 1, 3: 4, 4: 3 }[path.pop()?.[0]]
      if (test === undefined) break
      back = true
    } else test = randElm(newAvailable)

    // console.log(draw(grid)(pos))

    trg.push(test)
  }
  trg.push('END')
  trg.push([o2, grid])
}
const isDone = arr => arr.every(row => row.every(v => ['▓', 'O'].includes(v)))
const nextMoves = (arr, i, j) =>
  [
    [i - 1, j],
    [i + 1, j],
    [i, j + 1],
    [i, j - 1],
  ].filter(
    ([i, j]) => i >= 0 && j >= 0 && i < 41 && j < 41 && arr[i][j] === ' '
  )

const Gas = arr =>
  function expand(init = [33, 5]) {
    let ends = new Set([init.join(',')])
    let count = 0

    while (!isDone(arr)) {
      console.log(arr.map(r => r.join('')).join('\n'), count)

      count += 1

      let next = new Set()

      for (let pos of ends) {
        const available = nextMoves(arr, ...pos.split(',').map(v => +v))
        for (let [i, j] of available) {
          arr[i][j] = 'O'
          next.add(`${i},${j}`)
        }
      }

      ends = next
    }
    return count
  }

import Intcode from '../intcode'

const buildDroid = Intcode(input)
const buildMapper = Mapper()

const main = async () => {
  const io = { A: [], B: [] }

  const droid = buildDroid('D', io.A, io.B)
  const mapper = buildMapper('M', io.B, io.A)

  await Promise.all([droid(), mapper()])

  const [o2, grid] = io.A.flat()

  const arr = grid
    .arr()
    .map(row => row.map(v => (v === '█' ? '▓' : v === 'O' ? ' ' : v)))

  arr[33][5] = 'O'

  console.log(arr.map(r => r.join('')).join('\n'))

  console.log(Gas(arr)([33, 5]))
}

main()
