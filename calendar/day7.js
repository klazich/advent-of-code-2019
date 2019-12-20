import input from '../input/day7'

// Day 7: Amplification Circuit
// 1.
// 2.

import buildIntcode from '../intcode'

const computer = buildIntcode(input)

const combos = function*(iterable, c) {
  if (iterable.length === 0) yield c
  for (let i = 0; i < iterable.length; i += 1) {
    yield* combos(
      iterable.filter((_, j) => j !== i),
      [...c, iterable[i]]
    )
  }
}

for (let c of combos([0, 1, 2, 3], [])) console.log(c)
