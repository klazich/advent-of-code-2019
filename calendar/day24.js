import input from '../input/day24'

// Day 24: Planet of Discord
// 1. 32509983
// 2. 2012

const enumerate = function*(iterable) {
  for (let i = 0; i < iterable.length; i += 1) yield [i, iterable[i]]
}

const key = (d, i, j) => `${d},${i},${j}`
const cor = id => id.split(',').map(v => +v)

const parseInput = input =>
  input.split('\n').reduce(
    (set, row, i) =>
      row.split('').reduce((s, cell, j) => {
        return cell === '#' ? s.add(key(1, i, j)) : s
      }, set),
    new Set()
  )

const getAdjacent = id => {
  const [d, i, j] = cor(id)
  return [
    key(d, i + 1, j),
    key(d, i - 1, j),
    key(d, i, j + 1),
    key(d, i, j - 1),
  ]
}

const getRecursiveAdjacent = id => {
  let [d, i, j] = cor(id)
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ].reduce((a, [k, l]) => {
    if (k < 0) return [...a, key(d - 1, 1, 2)]
    if (k > 4) return [...a, key(d - 1, 3, 2)]
    if (l < 0) return [...a, key(d - 1, 2, 1)]
    if (l > 4) return [...a, key(d - 1, 2, 3)]
    if (k === 2 && l === 2) {
      if (i === 1 && j === 2)
        return [...a, ...Array.from({ length: 5 }, (_, x) => key(d + 1, 0, x))]
      if (i === 3 && j === 2)
        return [...a, ...Array.from({ length: 5 }, (_, x) => key(d + 1, 4, x))]
      if (i === 2 && j === 1)
        return [...a, ...Array.from({ length: 5 }, (_, x) => key(d + 1, x, 0))]
      if (i === 2 && j === 3)
        return [...a, ...Array.from({ length: 5 }, (_, x) => key(d + 1, x, 4))]
    }
    return [...a, key(d, k, l)]
  }, [])
}

const clamp = (size, fn) => (...args) =>
  fn(...args).filter(id => {
    const [_, i, j] = cor(id)
    return i >= 0 && j >= 0 && i < size && j < size
  })

// const getChanged = (cur, pre = new Set()) => {
//   const changed = new Set()
//   for (let id of cur) if (!pre.has(id)) changed.add(id)
//   for (let id of pre) if (!cur.has(id)) changed.add(id)
//   return changed
// }

// const toCheck = (changed, adjFn) => {
//   const check = new Set()
//   for (let id of changed) {
//     check.add(id)
//     for (let adj of adjFn(id)) check.add(adj)
//   }
//   return check
// }

const show = (set, c = '#') => {
  const arr = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => '.')
  )
  for (let id of set) {
    const [_, i, j] = cor(id)
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

const transformRecursive = cur => {
  const adjacents = getRecursiveAdjacent
  const check = new Set()
  for (let id of cur) {
    check.add(id)
    for (let adj of adjacents(id)) check.add(adj)
  }
  const next = new Set()
  for (let id of check) {
    const alive = cur.has(id)
    const sum = adjacents(id).reduce((s, adj) => s + (cur.has(adj) ? 1 : 0), 0)
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
  let state = parseInput(test)

  const seen = new Set()
  let G = show(state)

  let t = 0
  while (!seen.has(G)) {
    seen.add(G)
    console.log(G, t, biodiversity(state), '\n')
    state = transform(state)
    G = show(state)
    t += 1
  }
  console.log(seen.size, state, show(state), biodiversity(state))
}

main()

const main2 = (input, rounds) => {
  let state = parseInput(input)
  for (let i = 0; i < rounds; i += 1) {
    state = transformRecursive(state)
    console.log(i, state.size)
  }
  console.log(state.size)
}

main2(input, 200)
