// @ts-check
import input from '../input/day7'

// Day 7: Amplification Circuit
// 1. 92663
// 2. 14365052

import intMachine, { circuit } from '../intcode'

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

// const ampDiagnostic = chain(computer)()

// const result = runAmpDiagnostic(ampDiagnostic, [0, 1, 2, 3, 4])
// console.log(result)

const main = async () => {
  const baseMach = intMachine(input)
  const setup = circuit(baseMach)
  const phases = [5, 6, 7, 8, 9]

  let max = 0

  for (let seq of combos(phases)) {
    const run = await setup(seq)
    const result = run[0]
    if (result > max) {
      max = result
      console.log(seq)
    }
  }

  console.log(max)
}

main()
