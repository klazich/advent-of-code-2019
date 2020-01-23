import input from '../input/day24'

// Day 24: Planet of Discord
// 1. 32509983
// 2.

const enumerate = function*(iterable) {
  for (let i = 0; i < iterable.length; i += 1) yield [i, iterable[i]]
}

const key = (i, j) => `${i},${j}`
const cor = id => id.split(',').map(v => +v)

const parseInput = input =>
  input.split('\n').reduce(
    (set, row, i) =>
      row.split('').reduce((s, cell, j) => {
        return cell === '#' ? s.add(key(i, j)) : s
      }, set),
    new Set()
  )

const getAdjacent = id => {
  const [i, j] = cor(id)
  return [key(i + 1, j), key(i - 1, j), key(i, j + 1), key(i, j - 1)]
}

const clamp = (size, fn) => (...args) =>
  fn(...args).filter(id => {
    const [i, j] = cor(id)
    return i >= 0 && j >= 0 && i < size && j < size
  })

const getChanged = (cur, pre = new Set()) => {
  const changed = new Set()
  for (let id of cur) if (!pre.has(id)) changed.add(id)
  for (let id of pre) if (!cur.has(id)) changed.add(id)
  return changed
}

const toCheck = (changed, adjFn) => {
  const check = new Set()
  for (let id of changed) {
    check.add(id)
    for (let adj of adjFn(id)) check.add(adj)
  }
  return check
}

const show = (set, c = '#') => {
  const arr = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => '.')
  )
  for (let id of set) {
    const [i, j] = cor(id)
    arr[i][j] = c
  }
  return arr.map(r => r.join('')).join('\n')
}

const transform = (cur, pre = new Set()) => {
  const adjacent = clamp(5, getAdjacent)
  // const changed = getChanged(cur, pre)
  // const check = toCheck(changed, adjacent)
  const check = new Set()
  for (let id of cur) {
    check.add(id)
    for (let adj of adjacent(id)) check.add(adj)
  }

  // const next = new Set()
  // for (let i = 0; i < 5; i += 1)
  //   for (let j = 0; j < 5; j += 1) {
  //     const alive = cur.has(key(i, j))
  //     const sum = adjacent(key(i, j)).reduce((s, adj) => {
  //       return s + (cur.has(adj) ? 1 : 0)
  //     }, 0)
  //     if (alive && sum === 1) next.add(key(i, j))
  //     if (!alive && (sum === 1 || sum === 2)) next.add(key(i, j))
  //   }
  // return next

  const next = new Set()
  for (let id of check) {
    const alive = cur.has(id)
    const sum = adjacent(id).reduce((s, adj) => {
      return s + (cur.has(adj) ? 1 : 0)
    }, 0)
    if (alive && sum === 1) next.add(id)
    if (!alive && (sum === 1 || sum === 2)) next.add(id)
  }

  return next
}

const biodiversity = set =>
  show(set)
    .replace(/\n/g, '')
    .split('')
    .reduce((s, v, i) => s + (v === '#' ? 2 ** i : 0), 0)

const test = `....#
#..#.
#..##
..#..
#....`

const main = () => {
  let cur = parseInput(test)
  let pre = new Set()

  const seen = new Set()
  let G = show(cur)

  let t = 0
  while (!seen.has(G)) {
    seen.add(G)
    console.log(G, t, biodiversity(cur), '\n')
    const next = transform(cur, pre)
    pre = cur
    cur = next
    G = show(cur)
    t += 1
  }
  console.log(seen.size, cur, show(cur), biodiversity(cur))
}

main()
