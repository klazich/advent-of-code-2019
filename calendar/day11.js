import input from '../input/day11'

// Day 11: Space Police
// 1. 2339
// 2. PGUEPLPR

const unblock = () => new Promise(setImmediate)

class Hull {
  obj = {}
  static key(x, y) {
    return `${x},${y}`
  }
  get({ x, y }) {
    return this.obj[Hull.key(x, y)] ?? 0
  }
  set({ x, y }, v) {
    this.obj[Hull.key(x, y)] = v
    return this
  }
  get count() {
    return [...Object.keys(this.obj)].length
  }
}

const turn = (dir, next) => (4 + dir + (next === 0 ? -1 : 1)) % 4
const move = ({ dir, x, y }) => next => ({
  dir: turn(dir, next),
  x,
  y,
  ...{
    0: { y: y + 1 },
    1: { x: x + 1 },
    2: { y: y - 1 },
    3: { x: x - 1 },
  }[turn(dir, next)],
})

const Bot = (hull = new Hull()) => (id, src, trg) => async init => {
  let state = {
    hull,
    dir: 0,
    x: 0,
    y: 0,
    input: [],
  }

  trg.push(init)

  while (true) {
    while (state.input.length < 2) {
      if (src.length > 0) state.input.push(src.shift())
      else await unblock()

      if (state.input[0] === 'END') {
        trg.shift()
        trg.push(state)
        return
      }
    }

    // console.log(`[ID: ${id}] @${state.x},${state.y} :`, ...state.input)

    state = {
      ...state,
      hull: state.hull.set(state, state.input.shift()),
      ...move(state)(state.input.shift()),
    }

    trg.push(state.hull.get(state))
  }
}

const parseKey = s => s.split(',').map(v => +v)
const stringKey = (x, y) => `${x},${y}`
const [p, s] = [parseKey, stringKey]

const parsePath = path => Object.keys(path).map(s => p(s))
const max = points =>
  points.reduce(([mx, my], [x, y]) => [x > mx ? x : mx, y > my ? y : my], [
    -Infinity,
    -Infinity,
  ])
const min = points =>
  points.reduce(([mx, my], [x, y]) => [x < mx ? x : mx, y < my ? y : my], [
    Infinity,
    Infinity,
  ])

const display = path => {
  const tiles = parsePath(path)
  const [[x_min, y_min], [x_max, y_max]] = [min(tiles), max(tiles)]
  const height = y_max - y_min
  const width = x_max - x_min

  const img = Array.from({ length: height }, (_, i) =>
    Array.from(
      { length: width },
      (_, j) => path[s(j + x_min, y_max - i)] === 1 ? '#' : '_'
    ).join('')
  ).join('\n')

  console.log([x_min, y_min], [x_max, y_max], width, height)
  console.log(img)
}

import Intcode from '../intcode'

const buildBrain = Intcode(input)
const buildBot = Bot()

const main = async init => {
  const io = [[], []]

  const brain = buildBrain('A', io[0], io[1])
  const bot = buildBot('B', io[1], io[0])

  await Promise.all([bot(init), brain()])

  const { hull } = io.flat()[0]

  console.log(hull.count)
  display(hull.obj)
}

main(0)
main(1)
