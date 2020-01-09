import input from '../input/day13'

// Day 13: Care Package
// 1. 380
// 2. 18647

const unblock = () => new Promise(setImmediate)

import IntMachine from '../intcode'

/**
 * 0 - empty tile. No game object appears in this tile.
 * 1 - wall tile. Walls are indestructible barriers.
 * 2 - block tile. Blocks can be broken by the ball.
 * 3 - horizontal paddle tile. The paddle is indestructible.
 * 4 - ball tile. The ball moves diagonally and bounces off objects.
 */

input[0] = 2

const chars = { 0: ' ', 1: '█', 2: '■', 3: '━', 4: '' }

const makeGrid = () =>
  Array.from({ length: 26 }, () => Array.from({ length: 42 }, () => ' '))

const toStr = grid => score => {
  const tiles = grid.map(row => row.join('')).join('\n')
  return tiles + `  >> ${score} <<`
}

const setter = grid => (x, y, v) => {
  grid[y][x] = chars[v]
}

const Game = (grid = makeGrid()) => (id, src, trg) => async () => {
  let state = grid
  let paddle = null
  let ball = null
  let score = 0

  const set = setter(state)
  const img = toStr(state)

  while (true) {
    const input = []

    while (input.length < 3) {
      if (src.length > 0) input.push(src.shift())
      else await unblock()

      if (input[0] === 'END') {
        trg.shift()
        trg.push(score)
        return
      }
    }

    const [x, y, v] = input

    if (x === -1 && y === 0) score = v
    else set(x, y, v)
    if (v === 3 && paddle !== x) paddle = x
    if (v === 4 && ball !== x) ball = x

    if (typeof paddle === 'number' && typeof ball === 'number') {
      trg.shift()
      trg.push(Math.sign(ball - paddle))
      console.log(img(score))
    }
  }
}

const buildMachine = IntMachine(input)
const buildGame = Game()

const main = async () => {
  const io = { A: [], B: [] }

  const machine = buildMachine('M', io.A, io.B)
  const game = buildGame('G', io.B, io.A)

  await Promise.all([machine(), game()])

  console.log(io.A)
}

main()
