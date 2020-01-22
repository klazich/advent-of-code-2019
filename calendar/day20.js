import input from '../input/day20'

// Day 20: Donut Maze
// 1. 482
// 2.

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

const findNeighbors = (grid, test = () => true) =>
  function*([i, j]) {
    // prettier-ignore
    for (let [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const [k, l] = [i + a, j + b]
      if (test(grid[k][l])) yield [k, l]
    }
  }

const findPortal = grid => {
  const neighbors = findNeighbors(grid, v => v !== '#')
  return src => {
    for (let [i, j] of neighbors(src)) {
      const a = grid[i][j]
      if (/[A-Z]/.test(a)) {
        const [di, dj] = [i - src[0], j - src[1]]
        const b = grid[i + di][j + dj]
        const id = di + dj < 0 ? b + a : a + b
        const side =
          j > 2 && j < grid[2].length - 2 && i > 2 && i < grid.length - 2
            ? 'in'
            : 'out'
        return [id, side]
      }
    }
  }
}

const distancesProxyObject = () =>
  new Proxy(
    {},
    {
      get: (trg, p, receiver) =>
        Reflect.has(trg, p) ? Reflect.get(trg, p, receiver) : Infinity,
    }
  )

const findAdjacent = grid => {
  const neighbors = findNeighbors(grid, v => !/[A-Z#]/.test(v))
  const checkForPortal = findPortal(grid)

  return src => {
    const visited = new Set()
    const distances = distancesProxyObject()
    const items = []
    const queue = []

    distances[src.join(',')] = 0
    queue.push([src, 0])

    while (queue.length > 0) {
      const [node, d] = queue.shift()
      const key = node.join(',')

      if (visited.has(key)) continue
      else visited.add(key)

      if (d < distances[key]) distances[key] = d

      const portal = checkForPortal(node)

      if (d > 0 && portal) {
        const [id, side] = portal
        items.push({ id, side, d: distances[key] })
        continue
      }

      for (let next of neighbors(node)) queue.push([next, d + 1])
    }
    return items
  }
}

class Graph {
  G = {}
  constructor(input) {
    const grid = input.split('\n').map(r => r.split(''))
    const checkForPortal = findPortal(grid)
    const adjacents = findAdjacent(grid)

    for (let i = 2; i < grid.length - 2; i += 1) {
      const row = grid[i]
      for (let j = 2; j < row.length - 2; j += 1) {
        const cell = row[j]
        if (cell === '.') {
          const portal = checkForPortal([i, j])
          if (portal) {
            const [id, side] = portal
            this.set(id, side, adjacents([i, j]))
          }
        }
      }
    }
  }

  get(id, side) {
    return side ? this.G?.[id]?.[side] : this?.[id]
  }

  getAt(id, side, depth) {
    return this.get(id, side)
      .map(node => {
        const { id: next, side, d } = node
        return {
          id: next,
          side,
          d,
          depth: depth + (next === id ? (side === 'in' ? 1 : -1) : 0),
        }
      })
      .filter(({ id, depth }) => {
        if (depth > 0) return id !== 'AA' && id !== 'ZZ'
        return depth >= 0
      })
      // .sort((a, b) => a.d - b.d)
  }

  set(id, side, nodes) {
    this.G[id] = this.G[id] ?? {}
    return (this.G[id][side] =
      id !== 'AA' && id !== 'ZZ'
        ? [{ id, side: side === 'in' ? 'out' : 'in', d: 1 }, ...nodes]
        : nodes)
  }
}

// const start = [112, 65]
// const end = [75, 2]

const minimumPath = input => {
  const graph = new Graph(input)

  return (src, trg) => {
    const visited = new Set()
    const distances = distancesProxyObject()
    const queue = [[src, 0]]

    distances[src] = 0

    while (queue.length > 0) {
      const [[id, side], dist] = queue.shift()
      const key = `${id},${side}`

      if (dist < distances[key]) distances[key] = dist

      if (id === trg[0]) return distances[key]

      if (visited.has(key)) continue
      else visited.add(key)

      for (let neighbor of graph.get(id, side)) {
        const { id, side, d } = neighbor
        queue.push([[id, side], d + dist])
      }
    }

    return distances
  }
}

console.log(minimumPath(input)(['AA', 'out'], ['ZZ', 'out']))

const minimumPath2 = input => {
  const graph = new Graph(input)

  return (src, trg) => {
    const visited = new Set()
    const distances = distancesProxyObject()
    const queue = [[src, 0]]

    distances[src] = 0

    while (queue.length > 0) {
      const [[id, side, depth], dist] = queue.shift()
      const key = `${id},${side},${depth}`

      if (dist < distances[key]) distances[key] = dist

      if (id === trg[0]) return distances[key]

      if (visited.has(key)) continue
      else visited.add(key)

      console.log(
        id,
        side.padEnd(3, ' '),
        depth.toString().padStart(5, ' '),
        dist.toString().padStart(5, ' '),
        distances[key].toString().padStart(5, ' '),
        graph
          .getAt(id, side, depth)
          .map(({ id, side, d, depth }) => `${id}-${side}-${depth} ${d}`)
      )

      for (let neighbor of graph.getAt(id, side, depth)) {
        const { id, side, d, depth } = neighbor
        queue.push([[id, side, depth], d + dist])
      }

      queue.sort((a, b) => a[1] - b[1]).sort((a, b) => a[0][2] - b[0][2])
    }
  }
}

const result = minimumPath2(input)(['AA', 'out', 0], ['ZZ', 'out', 0])

// console.log(Object.entries(result).sort())
console.log(result)
