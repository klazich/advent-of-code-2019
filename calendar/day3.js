import input from '../input/day3'

// Day 3: Crossed Wires
// 1. 225
// 2.

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

const path1 = new Set()
const path2 = new Set()

for (let co of path(wire1)) path1.add(co.join(','))
for (let co of path(wire2)) path2.add(co.join(','))

let intersects1 = new Set()

path1.forEach(v => {
  if (path2.has(v)) intersects1.add(v)
})

let intersects2 = new Set()

path2.forEach(v => {
  if (path1.has(v)) intersects2.add(v)
})

console.log(intersects1)
console.log(intersects2)

const weighted = [...intersects1].map((s, i) => [
  s,
  i + [...intersects2].indexOf(s),
])
console.log(weighted)

// 789 286

let result = 0

for (let co of path1) {
  result += 1
  if (co === '789,286') break
}
for (let co of path2) {
  result += 1
  if (co === '789,286') break
}
console.log(result)

