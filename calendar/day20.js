import input from '../input/day20'

// Day 20: Donut Maze
// 1.
// 2.

const enumerate = function*(iterable) {
  for (let i = 0; i < iterable.length; i += 1) yield [i, iterable[i]]
}

const count = function*(start = 0) {
  let n = start
  while (true) yield n++
}

const range = function*(start = 0, length = Infinity, step = 1) {
  for (let n = start; n < start + length; n += step) yield n
}

const buildGrid = input => {
  const char = (function*() {
    for (let ch of 'BCDEFGHIJKLMNOPQRSTUVWXY1234567890') yield ch
  })()

  const ids = {}
  const arr = input.split('\n').map(r => r.split(''))

  for (let [c] of enumerate(arr[0])) {
    
  }
}

const findPortals = input => {
  const arr = input.split('\n').map(r => r.split(''))

  const hor = function*(i) {
    for (let [c, cell] of enumerate(arr[i]))
      if (/[A-Z]/.test(cell)) yield cell + arr[i + 1][c]
  }
  const ver = function*(j) {
    for (let [_, row] of enumerate(arr))
      if (/[A-Z]/.test(row[j])) yield row[j] + row[j + 1]
  }

  const portals = new Set()

  for (let found of hor(0)) portals.add(found)
  for (let found of hor(29)) portals.add(found)
  for (let found of hor(84)) portals.add(found)
  for (let found of hor(113)) portals.add(found)
  for (let found of ver(0)) portals.add(found)
  for (let found of ver(29)) portals.add(found)
  for (let found of ver(82)) portals.add(found)
  for (let found of ver(111)) portals.add(found)

  return Array.from(portals).sort()
}

const findNeighbors = grid =>
  function*([i, j]) {
    // prettier-ignore
    for (let [a, b] of [[1, 0],[-1, 0],[0, 1],[0, -1]]) {
      const [k, l] = [i + a, j + b]
      if (grid[k][l] !== '#') yield [k, l]
    }
  }

console.log(findPortals(input))
