import input from '../input/day18'

// Day 18: Many-Worlds Interpretation
// 1. 6286
// 2.

const isDoor = str => /[A-Z]/.test(str)
const isKey = str => /[a-z]/.test(str)

const enumerate = function*(iterable) {
  for (let i = 0; i < iterable.length; i += 1) yield [i, iterable[i]]
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

const findNeighbors = grid =>
  function*([i, j]) {
    // prettier-ignore
    for (let [a, b] of [[1, 0],[-1, 0],[0, 1],[0, -1]]) {
      const [k, l] = [i + a, j + b]
      if (grid[k][l] !== '#') yield [k, l]
    }
  }

// const findAdjacent = grid => {
//   const neighbours = findNeighbors(grid)

//   return function* walk(init, visited = new Set(), dist = 1) {
//     visited.add(init.join(','))
//     for (let [i, j] of neighbours(init)) {

//       const tile = grid[i][j]
//       if (tile !== '#' && !visited.has(`${i},${j}`)) {
//         console.log(init, dist)
//         if (/[a-zA-Z]/.test(tile)) yield [tile, dist]
//         else yield* walk([i, j], visited.add(`${i},${j}`), dist + 1)
//       }
//     }
//   }
// }

const findAdjacent = grid => {
  const neighbours = findNeighbors(grid)

  return src => {
    const visited = new Set()
    const distances = new Proxy(
      {},
      {
        get(trg, p, receiver) {
          return Reflect.has(trg, p) ? Reflect.get(trg, p, receiver) : Infinity
        },
      }
    )
    const items = {}
    const queue = []

    distances[src.join(',')] = 0
    queue.push([src, 0])

    while (queue.length > 0) {
      const [node, d] = queue.shift()

      if (visited.has(node.join(','))) continue

      const dist = d + 1

      for (let [i, j] of neighbours(node)) {
        const tile = grid[i][j]
        if (tile !== '#' && !visited.has(`${i},${j}`)) {
          if (dist < distances[`${i},${j}`]) distances[`${i},${j}`] = dist
          if (/[a-zA-z]/.test(tile)) {
            items[tile] = (items[tile] ?? 0) + distances[`${i},${j}`]
          } else queue.push([[i, j], dist])
        }
      }

      visited.add(node.join(','))
    }

    return Object.entries(items)
  }
}

const buildGraph = input => {
  const graph = {}

  const grid = input.split('\n').map(r => r.split(''))
  const adjacents = findAdjacent(grid)

  for (let [i, row] of enumerate(grid))
    for (let [j, tile] of enumerate(row))
      if (/[a-zA-z@]/.test(tile)) graph[tile] = adjacents([i, j])

  return graph
}

const reachableKeys = graph => {
  const fn = memoize(function rkFn(init, ...held) {
    const distances = Object.keys(graph).reduce((m, v) => {
      m[v] = Infinity
      return m
    }, {})
    const queue = []

    queue.push([init, 0])

    while (queue.length > 0) {
      const [node, dist] = queue.shift()
      if (dist < distances[node]) distances[node] = dist
      else continue

      if (isDoor(node) && !held.includes(node.toLowerCase())) continue
      if (node !== init && isKey(node) && !held.includes(node)) continue

      for (let [neighbor, weight] of graph[node]) {
        const nextDist = dist + weight
        queue.push([neighbor, nextDist])
      }
    }

    return Object.entries(distances)
      .filter(
        ([k, v]) => isKey(k) && !held.includes(k) && k !== init && v < Infinity
      )
      .sort((a, b) => a[1] - b[1])
  })

  return fn
}

const keys = graph => Object.keys(graph).filter(v => isKey(v))

const minimumPath = graph => {
  const reachable = reachableKeys(graph)
  const count = keys(graph).length

  const fn = memoize(function mpFn(src, ...held) {
    if (held.length === count) return 0

    let min = Infinity

    for (let [n, d] of reachable(src, ...held)) {
      const nextHeld = [...held, n].sort()
      const dist = d + fn(n, ...nextHeld)
      if (dist < min) min = dist
    }

    return min
  })

  return fn
}

const graph = buildGraph(input)

const minSteps = minimumPath(graph)('@')
console.log(minSteps)
