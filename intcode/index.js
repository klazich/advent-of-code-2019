// @ts-check

/**
 * @typedef {Object<string, any>} State The state object
 * @property {number[]} program Intcode instruction set
 * @property {Generator<number>} input 
 * @property {number} ip
 * @property {number} opcode
 * @property {number} [output]
 * @property {Generator<number>} [modes]
 */

/**
 * @param {number} n
 * @returns {(state: State) => [number[], number]}
 */
const nextInstruction = n => state => {
  const { program, ip } = state
  const instruction = program.slice(ip, ip + n)
  return [instruction, ip + n]
}

const next1 = nextInstruction(1)
const next2 = nextInstruction(2)
const next3 = nextInstruction(3)

/** @param {State} state */
const add = state => {
  const [[p1, p2, to], ip] = next3(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  program[to] = v1 + v2
  return { ...state, program, ip }
}

/** @param {State} state */
const mul = state => {
  const [[p1, p2, to], ip] = next3(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  program[to] = v1 * v2
  return { ...state, program, ip }
}

/** @param {State} state */
const mov = state => {
  const [[to], ip] = next1(state)
  const { program, input } = state
  program[to] = input.next().value
  return { ...state, program, input, ip }
}

/** @param {State} state */
const out = state => {
  const [[p1], ip] = next1(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  console.log(v1)
  return { ...state, ip, output: v1 }
}

/** @param {State} state */
const jnz = state => {
  const [[p1, p2], ip] = next2(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  const nextIp = v1 !== 0 ? v2 : ip
  return { ...state, ip: nextIp }
}

/** @param {State} state */
const jez = state => {
  const [[p1, p2], ip] = next2(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  const nextIp = v1 === 0 ? v2 : ip
  return { ...state, ip: nextIp }
}

/** @param {State} state */
const lsn = state => {
  const [[p1, p2, to], ip] = next3(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  program[to] = v1 < v2 ? 1 : 0
  return { ...state, program, ip }
}

/** @param {State} state */
const eql = state => {
  const [[p1, p2, to], ip] = next3(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  program[to] = v1 === v2 ? 1 : 0
  return { ...state, program, ip }
}

/** @param {number} code */
const ops = code => {
  if (code === 1) return add
  if (code === 2) return mul
  if (code === 3) return mov
  if (code === 4) return out
  if (code === 5) return jnz
  if (code === 6) return jez
  if (code === 7) return lsn
  if (code === 8) return eql
  return /** @type {(s: State) => State} */ s => s
}

/** @param {State} state */
const exec = state => {
  const { opcode } = state
  const fn = ops(opcode)
  return fn(state)
}

/**
 * @param {number} code
 * @returns {Generator<number>}
 */
const Opcode = function*(code) {
  const padded = `${code}`.padStart(5, '0')
  yield +padded.slice(3)
  yield +padded[2]
  yield +padded[1]
  yield +padded[0]
}

/** @param {State} state */
const parseOpcode = state => {
  const [[code], ip] = next1(state)
  const modes = Opcode(code)
  const opcode = modes.next().value
  return { ...state, ip, opcode, modes }
}

/**
 * @param {((x: State) => State)[]} fns
 * @returns {(init: State) => State} 
 */
const pipe = (...fns) => init => fns.reduce((v, fn) => fn(v), init)

const next = pipe(parseOpcode, exec)

/**
 * @param {number[]} iterable
 * @returns {Generator<number>}
 */
const makeIter = function*(iterable) {
  for (let e of iterable) yield e
}

/** @param {number[]} arr */
const copyArray = arr => [...arr]

/**
 * @param {number[]} intcode
 * @returns {(init: number[]) => number}
 */
const buildIntcode = intcode => init => {
  /** @type State */
  let state = {
    program: copyArray(intcode),
    input: makeIter(init),
    ip: 0,
    opcode: 0,
  }

  while (state.opcode !== 99) state = next(state)

  return state.output
}

export default buildIntcode
