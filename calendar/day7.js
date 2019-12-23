// @ts-check
import input from '../input/day7'

// Day 7: Amplification Circuit
// 1. 92663
// 2.

import buildIntcode from '../intcode'
import init from '../intcode/gen'

const computer = buildIntcode(input)

/** @type {(fn : (a: [number, number]) => number) => (init?: number) => (seq: number[]) => number} */
const chain = fn => (init = 0) => seq => {
  let next = init
  for (let x of seq) next = fn([x, next])
  return next
}

/**
 * @param {any[]} iterable
 * @param {any[]} [c=[]]
 * @returns {Generator<number[]>}
 */
const combos = function*(iterable, c = []) {
  if (iterable.length === 0) yield c
  for (let i = 0; i < iterable.length; i += 1) {
    yield* combos(
      iterable.filter((_, j) => j !== i),
      [...c, iterable[i]]
    )
  }
}

/**
 * @param {(arr: number[]) => number} fn
 * @param {number[]} seq
 */
const runAmpDiagnostic = (fn, seq) => {
  const seqFn = combos(seq)
  let highest = 0
  for (let arr of seqFn) {
    const result = fn(arr)
    if (result > highest) highest = result
    console.log(result, arr)
  }
  return highest
}

const ampDiagnostic = chain(computer)()

// const result = runAmpDiagnostic(ampDiagnostic, [0, 1, 2, 3, 4])
// console.log(result)

init([
  3,
  26,
  1001,
  26,
  -4,
  26,
  3,
  27,
  1002,
  27,
  2,
  27,
  1,
  27,
  26,
  27,
  4,
  27,
  1001,
  28,
  -1,
  28,
  1005,
  28,
  6,
  99,
  0,
  0,
  5,
])([9, 8, 7, 6, 5])
