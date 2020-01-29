import { parseOpcode, exec } from './operations'
import logger from './logger'
import parseIntcode from './parseIntcode'

const unblock = () => new Promise(setImmediate)

const take = async (arr, id) => {
  // let t = 0
  while (true) {
    // t += 1
    if (arr.length > 0) return arr.shift()
    else await unblock()
    // if (t === 10000) console.log('WAITING', id ?? '')
  }
}

export const circuit = baseMachine => async seq => {
  const io = Array.from({ length: seq.length }, (_, i) => (i === 0 ? [0] : []))
  const machines = seq.map((phase, i) => baseMachine(i, phase))

  await Promise.all(
    machines.map((mach, i) => mach(io[i], io[i === seq.length - 1 ? 0 : i + 1]))
  )

  return io.flat()
}

const BuildIntcode = intcode => (id, src, trg) => async () => {
  const log = logger(id)

  let state = {
    prog: parseIntcode(intcode),
    ip: 0,
    rb: 0,
    opcode: null,
    modes: null,
    input: [],
    output: null,
  }

  while (state.prog[state.ip] !== 99) {
    state = parseOpcode(state)

    if (state.opcode === 3) {
      const input = await take(src, id)
      state.input.push(input)
    }

    // state = exec(state, log)
    state = exec(state)

    if (state.opcode === 4) {
      trg.push(state.output)
    }

    await unblock()
  }

  trg.push(null)
}

export const BuildASCII = intcode => (id, src, trg) => async () => {
  const Intcode = BuildIntcode(intcode)
  const io = { in: [], out: [] }

  const processInput = (src, trg) => async () => {
    while (true) {
      const ins = await take(src)
      const stream = ins.split('').map(s => s.charCodeAt(0))
      trg.push(...stream, 10)
    }
  }

  const processOutput = (src, trg) => async () => {
    let str = ''
    while (true) {
      const code = await take(src)
      if (code === 10) {
        trg.push(str)
        str = ''
      } else str += String.fromCharCode(code)
    }
  }

  const computer = Intcode(id, io.in, io.out)
  const input = processInput(src, io.in)
  const output = processOutput(io.out, trg)

  Promise.all([input(), output(), computer()])
}

export default BuildIntcode
