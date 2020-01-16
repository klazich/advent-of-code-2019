import input from '../input/day18'

// Day 18: Many-Worlds Interpretation
// 1.
// 2.

const isDoor = str => /[A-Z]/.test(str)
const isKey = str => /[a-z]/.test(str)

const Node = (i, j, value, count) => ({
  value,
  count,
  get pos() {
    return [i, j]
  },
  get id() {
    return `${i},${j}`
  },
})

const getter = grid => ([i, j]) => grid[i][j]

const enumerate = function*(iterable) {
  for (let i = 0; i < iterable.length; i += 1) yield [i, iterable[i]]
}

const memoize = fn => {
  const cache = {}
  return new Proxy(fn, {
    apply(target, thisArg, argsList) {
      const key = [target.name, ...argsList].toString()
      if (cache[key]) console.log('CACHE', key)
      if (!cache[key]) cache[key] = Reflect.apply(target, thisArg, argsList)

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

const findAdjacent = grid => {
  const neighbours = findNeighbors(grid)

  return function* walk(init, visited = new Set(), dist = 1) {
    visited.add(init.join(','))
    for (let [i, j] of neighbours(init)) {
      const tile = grid[i][j]
      if (tile !== '#' && !visited.has(`${i},${j}`)) {
        if (/[a-zA-Z]/.test(tile)) yield [tile, dist]
        else yield* walk([i, j], visited.add(`${i},${j}`), dist + 1)
      }
    }
  }
}

const buildGraph = input => {
  const graph = {}

  const grid = input.split('\n').map(r => r.split(''))
  const adjacents = findAdjacent(grid)

  for (let [i, row] of enumerate(grid))
    for (let [j, tile] of enumerate(row))
      if (/[a-zA-z@]/.test(tile)) {
        const found = []
        for (let adj of adjacents([i, j])) found.push(adj)
        graph[tile] = found.sort((a, b) => a[1] - b[1])
      }

  return graph
}

const reachableKeys = graph => {
  const distances = Object.keys(graph).reduce((m, v) => {
    m[v] = Infinity
    return m
  }, {})
  const queue = []

  const rkFn = (init, ...held) => {
    queue.push([init, 0])

    while (queue.length > 0) {
      const [node, dist] = queue.shift()
      if (dist < distances[node]) distances[node] = dist
      else continue

      if (isDoor(node) && !held.includes(node.toLowerCase())) continue

      for (let [neighbor, weight] of graph[node]) {
        const nextDist = dist + weight
        queue.push([neighbor, nextDist])
      }
    }

    return Object.entries(distances)
      .filter(([k, v]) => isKey(k) && !held.includes(k) && v < Infinity)
      .sort((a, b) => a[1] - b[1])
  }

  return memoize(rkFn)
}

const minimumPath = graph => {
  const reachable = reachableKeys(graph)

  const mpFn = (init, ...held) => {
    if (held.length === 26) return 0

    const min = Infinity

    for (let [n, d] of reachable(init, ...held)) {
      console.log(init, n, d)
      const nextHeld = [...held, n].sort()
      const dist = d + mpFn(n, ...nextHeld)
      if (dist < min) min = dist
    }

    return min
  }

  return memoize(mpFn)
}

// 1. Mark all nodes unvisited. Create a set of all the unvisited nodes called the unvisited set.
// 2. Assign to every node a tentative distance value: set it to zero for our initial node and to
//    infinity for all other nodes. Set the initial node as current.[13]
// 3. For the current node, consider all of its unvisited neighbours and calculate their tentative
//    distances through the current node. Compare the newly calculated tentative distance to the
//    current assigned value and assign the smaller one. For example, if the current node A is
//    marked with a distance of 6, and the edge connecting it with a neighbour B has length 2, then
//    the distance to B through A will be 6 + 2 = 8. If B was previously marked with a distance
//    greater than 8 then change it to 8. Otherwise, the current value will be kept.
// 4. When we are done considering all of the unvisited neighbours of the current node, mark the
//    current node as visited and remove it from the unvisited set. A visited node will never be
//    checked again.
// 5. If the destination node has been marked visited (when planning a route between two specific
//    nodes) or if the smallest tentative distance among the nodes in the unvisited set is infinity
//    (when planning a complete traversal; occurs when there is no connection between the initial
//    node and remaining unvisited nodes), then stop. The algorithm has finished.
// 6. Otherwise, select the unvisited node that is marked with the smallest tentative distance, set
//    it as the new "current node", and go back to step 3.

const graph = buildGraph(input)
const minSteps = minimumPath(graph)('@')

console.log(minSteps)
