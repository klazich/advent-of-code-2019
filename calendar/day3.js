import input from '../input/day3'

// Day 3: Crossed Wires
// 1. 225
// 2. 35194

const [wire1, wire2] = input

const manhattanDist = p => q => Math.abs(p.x - q.x) + Math.abs(p.y - q.y)

const moveFn = dir => ([x, y, z]) =>
  ({
    U: [x, y + 1],
    D: [x, y - 1],
    L: [x - 1, y],
    R: [x + 1, y],
  }[dir])

const path = function*(instructions) {
  let pos = [0, 0]
  for (let [dir, count] of instructions) {
    const fn = moveFn(dir)
    while (count > 0) {
      pos = fn(pos)
      yield pos
      count -= 1
    }
  }
}

const path1 = new Map()
const path2 = new Map()
let cnt = 0

for (let co of path(wire1)) {
  cnt += 1
  path1.set(co.join(','), cnt)
}
cnt = 0
for (let co of path(wire2)) {
  cnt += 1
  path2.set(co.join(','), cnt)
}

let intersects = new Set()

path1.forEach((v, k) => {
  if (path2.has(k)) intersects.add(path1.get(k) + path2.get(k))
})

console.log(Math.min(...intersects))
