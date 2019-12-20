import input from '../input/day6'

// Day 6: Universal Orbit Map
// 1. 249308
// 2. 349

const parse = input => input.map(map => map.split(')'))

const list = edges => Array.from(new Set(edges.flat()))

const mapEdges = edges => {
  const map = new Map()
  for (let [a, b] of edges) map.set(b, a)
  return map
}

const countOrbits = map => origin => {
  let count = 0
  let obj = origin
  while (map.has(obj)) {
    obj = map.get(obj)
    count += 1
  }
  return count
}

const edges = parse(input)
const objects = list(edges)
const map = mapEdges(edges)
const counter = countOrbits(map)

const count1 = objects.reduce((sum, obj) => sum + counter(obj), 0)

console.log(count1)

const pathTo = map => trg => org => {
  const path = []
  let o = map.get(org)
  while (map.get(o) !== trg) {
    path.push(o)
    o = map.get(o)
  }
  return path
}

const pathToCOM = pathTo(map)('COM')
const pathYOU = pathToCOM('YOU')
const pathSAN = pathToCOM('SAN')

let count2 = 0
for (let obj of pathYOU)
  if (pathSAN.includes(obj)) break
  else count2 += 1
for (let obj of pathSAN)
  if (pathYOU.includes(obj)) break
  else count2 += 1

console.log(count2)
