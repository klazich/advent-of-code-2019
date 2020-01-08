import input from '../input/day13'

// Day 13: Care Package
// 1. 380
// 2.

/** UTILS **/

const by3 = function*(iterable) {
  let arr = []
  for (let e of iterable) {
    arr.push(e)
    if (arr.length === 3) {
      yield [...arr]
      arr = []
    }
  }
}

const count = type => board => {
  let n = 0
  for (let v of board.values()) if (v === type) n += 1
  return n
}

const unblock = () => new Promise(setImmediate)

/** MAIN **/

import IntMachine from '../intcode'
import Grid from '../grid'

/**
 * 0 - empty tile. No game object appears in this tile.
 * 1 - wall tile. Walls are indestructible barriers.
 * 2 - block tile. Blocks can be broken by the ball.
 * 3 - horizontal paddle tile. The paddle is indestructible.
 * 4 - ball tile. The ball moves diagonally and bounces off objects.
 */

input[0] = 2
const buildMachine = IntMachine(input)

const compile = () => {
  const io = { in: [], out: [] }
  return {
    machine: buildMachine('A', io.in, io.out),
    grid: Grid(),
    io,
  }
}

const processOutput = async function*(data) {
  while (true) {
    const values = []
    while (values.length < 3) {
      if (data.length > 0) values.push(data.shift())
      else await unblock()
    }
    yield values
  }
}

const main = async () => {
  const { machine, grid, io } = compile()

  machine()

  let pos = {paddle: null, ball: null}

  for await (let [x, y, v] of processOutput(io.out)) {
    grid.write(x, y, v)

    


    if (typeof grid.tilt === 'number' && io.in.length === 0) {
      io.in.push(grid.tilt)
      console.log(grid.toString())
      console.log(grid.paddle, grid.ball, grid.tilt)
    }
    // if (v === 3 || v === 4) console.log(grid.paddle, grid.ball, grid.tilt)
    // if (x === -1) console.log(grid.toString())
  }
}

main()
