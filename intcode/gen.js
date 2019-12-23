// @ts-check

const modify = (obj, k, v) => {
  obj[k] = v
  return obj
}

const pipe = (...fns) => init => fns.reduce((x, f) => f(x), init)

const add = x => y => z => state => modify(state, z, x + y)
const mul = x => y => z => state => modify(state, z, x * y)
const jnz = x => y => state => modify(state, 'ip', x !== 0 ? y : state.ip)
const jez = x => y => state => modify(state, 'ip', x === 0 ? y : state.ip)
const lsn = x => y => z => state => modify(state, z, x < y ? 1 : 0)
const eql = x => y => z => state => modify(state, z, x === y ? 1 : 0)

const run = fn => modes => (...params) => state =>
  params.reduce((f, v, i) => f((modes[i] ?? 0) === 1 ? state[v] : v), fn)(state)

const machine = intcode =>
  function*() {
    let state = { program: [...intcode], ip: 0 }

    const parseOpcode = ({ program, ip }) => [
      {
        opcode: +program[ip].slice(-2),
        modes: [...program.slice(0, -2)].map(v => +v).reverse(),
      },
      { program, ip: ip + 1 },
    ]
  }

/**
 * @typedef {Object<string, any>} State The state object
 * @property {number[]} program Intcode instruction set
 * @property {number} input
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
  program[to] = input
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

/** @param {number[]} arr */
const copyArray = arr => [...arr]

// /**
//  * @param {number[]} intcode
//  * @returns {(init: number[]) => number}
//  */
// const buildIntcode = intcode => init => {
//   /** @type {State} */
//   let state = {
//     program: copyArray(intcode),
//     input: makeIter(init),
//     ip: 0,
//     opcode: 0,
//   }

//   while (state.opcode !== 99) state = next(state)

//   return state.output
// }

function coroutine(generatorFunction) {
  return function(...args) {
    let generatorObject = generatorFunction(...args)
    generatorObject.next()
    return generatorObject
  }
}

const buildIntcode = intcode => (phase, name) =>
  coroutine(function*(receiver) {
    let initiated = false
    let state = /** @type {State} */ ({
      program: copyArray(intcode),
      ip: 0,
      opcode: 0,
    })

    try {
      while (state.output !== 99) {
        if (state.opcode === 4) receiver.next(state.output)
        const next = parseOpcode(state)
        if (next.opcode === 3) {
          next.input = !initiated ? phase : yield
          initiated = true
        }
        state = exec(next)
      }
    } finally {
      receiver.next(state.output)
      console.log(name, state.output)
    }
  })

/** @type {(intcode: number[]) => (seq: number[]) => void} */
const init = intcode => seq => {
  const computer = buildIntcode(intcode)
  const ampA = computer(seq[0], 'A')
  const ampB = computer(seq[1], 'B')
  const ampC = computer(seq[2], 'C')
  const ampD = computer(seq[3], 'D')
  const ampE = computer(seq[4], 'E')
  const chained = ampA(ampB(ampC(ampD(ampE(ampA)))))
  chained.next(0)
}

export default init
