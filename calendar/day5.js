import input from '../input/day5'
import IntCode from '../intcode'

// Day 5: Sunny with a Chance of Asteroids
// 1. 6745903
// 2. 9168267

const intcode = [...input]

const nextInstruction = n => state => {
  const { program, ip } = state
  const instruction = program.slice(ip, ip + n)
  return [instruction, ip + n]
}
const next1 = nextInstruction(1)
const next2 = nextInstruction(2)
const next3 = nextInstruction(3)

const add = state => {
  const [[p1, p2, to], ip] = next3(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  program[to] = v1 + v2
  return { ...state, ip, program }
}

const mul = state => {
  const [[p1, p2, to], ip] = next3(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  program[to] = v1 * v2
  return { ...state, ip, program }
}

const mov = state => {
  const [[to], ip] = next1(state)
  const { program, input } = state
  program[to] = input
  return { ...state, ip, program }
}

const out = state => {
  const [[p1], ip] = next1(state)
  const { program, modes, output } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  output.push(v1)
  console.log(v1)
  return { ...state, ip, output }
}

const jnz = state => {
  const [[p1, p2], ip] = next2(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  const nextIp = v1 !== 0 ? v2 : ip
  return { ...state, ip: nextIp }
}

const jez = state => {
  const [[p1, p2], ip] = next2(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  const nextIp = v1 === 0 ? v2 : ip
  return { ...state, ip: nextIp }
}

const lsn = state => {
  const [[p1, p2, to], ip] = next3(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  program[to] = v1 < v2 ? 1 : 0
  return { ...state, ip, program }
}

const eql = state => {
  const [[p1, p2, to], ip] = next3(state)
  const { program, modes } = state
  const v1 = modes.next().value === 0 ? program[p1] : p1
  const v2 = modes.next().value === 0 ? program[p2] : p2
  program[to] = v1 === v2 ? 1 : 0
  return { ...state, ip, program }
}

const ops = code =>
  ({
    1: add,
    2: mul,
    3: mov,
    4: out,
    5: jnz,
    6: jez,
    7: lsn,
    8: eql,
    99: s => s,
  }[code])

const exec = state => {
  const { opcode } = state
  const fn = ops(opcode)
  return fn(state)
}

const Opcode = function*(code) {
  const padded = `${code}`.padStart(5, '0')
  yield +padded.slice(3)
  yield +padded[2]
  yield +padded[1]
  yield +padded[0]
}

const parseOpcode = state => {
  const [[code], ip] = next1(state)
  const modes = Opcode(code)
  const opcode = modes.next().value
  return { ...state, ip, opcode, modes }
}

const pipe = (...fns) => init => fns.reduce((v, fn) => fn(v), init)

const next = pipe(parseOpcode, exec)

const build = intcode => input => {
  let state = {
    program: [...intcode],
    input,
    ip: 0,
    opcode: 0,
    output: [],
  }

  while (state.opcode !== 99) state = next(state)

  return state.output
}

const diagnostic = build(intcode)
const airConDiagnostic = diagnostic(1)
const TRCDiagnostic = diagnostic(5)

console.log(airConDiagnostic)
console.log(TRCDiagnostic)
