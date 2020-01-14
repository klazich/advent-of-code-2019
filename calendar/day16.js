import input from '../input/day16'

// Day 16: Flawed Frequency Transmission
// 1. 74608727
// 2. 57920757

const repeat = function*(v, n) {
  for (let i = 0; i < n; i += 1) yield v
}

const dropFirst = function*(genObj) {
  genObj.next()
  for (let v of genObj) yield v
}

const basePattern = function*() {
  const a = [0, 1, 0, -1]
  while (true) for (let v of a) yield v
}

const patternRepeat = function*(n) {
  for (let base of basePattern()) for (let v of repeat(base, n)) yield v
}

const processIndex = signal => {
  const arr = signal.split('').map(v => +v)

  return i => {
    const pattern = dropFirst(patternRepeat(i + 1))

    let acc = 0
    for (let v of arr) acc += v * pattern.next().value

    return +`${acc}`.slice(-1)
  }
}

const phase = signal => {
  const process = processIndex(signal)

  let next = []

  for (let i = 0; i < signal.length; i += 1) next.push(process(i))

  return next.join('')
}

const phaseN = n => init => {
  let signal = init
  for (let i = 0; i < n; i += 1) signal = phase(signal)
  return signal
}

const phase100 = phaseN(100)




// 0 | +0-0+0-0+0-0+0-0+0-0+0-0+0-0+
// 1 | 0++00--00++00--00++00--00++00
// 2 | 00+++000---000+++000---000+++
// 3 | 000++++0000----0000++++0000--
// 4 | 0000+++++00000-----00000+++++
// 5 | 00000++++++000000------000000
// 6 | 000000+++++++0000000-------00

/**
 *       0 1 2 3 4 5 6
 *     ┌─┴─┴─┴─┴─┴─┴─┴─┐
 *  0 ─┤ + 0 - 0 + 0 - │
 *  1 ─┤ 0 + + 0 0 - - │
 *  2 ─┤ 0 0 + + + 0 0 │
 *  3 ─┤ 0 0 0 + + + + │
 *  4 ─┤ 0 0 0 0 + + + │ >>
 *  5 ─┤ 0 0 0 0 0 + + │ >> n5 + n6
 *  6 ─┤ 0 0 0 0 0 0 + │ >> n6
 *
 */

const phase2 = signalFromOffset => {
  const state = signalFromOffset

  let next = ''
  let sum = 0

  for (let i = state.length - 1; i >= 0; i -= 1) {
    sum += +state[i]
    next = `${sum}`.slice(-1) + next
  }
  return next
}

const input10000 = input.repeat(10000)
const offset = 5973847
const signal = input10000.slice(offset)
console.log(signal.length)
console.log(phase2(signal).length)

let state = signal
for (let i = 0; i < 100 ; i += 1) {
  state = phase2(state)
}

console.log(state.slice(0, 8)) // 57920757
