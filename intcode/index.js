import { parseOpcode, exec } from './operations'
import logger from './logger'
import parseIntcode from './parseIntcode'

const unblock = () => new Promise(setImmediate)

export const circuit = baseMachine => async seq => {
  const io = Array.from({ length: seq.length }, (_, i) => (i === 0 ? [0] : []))
  const machines = seq.map((phase, i) => baseMachine(i, phase))

  await Promise.all(
    machines.map((mach, i) => mach(io[i], io[i === seq.length - 1 ? 0 : i + 1]))
  )

  return io.flat()
}

export default intcode => (id, phase) => async (src, trg) => {
  const log = logger(id)

  let state = {
    prog: parseIntcode(intcode),
    ip: 0, // ip: 2,
    rb: 0,
    opcode: null,
    modes: null,
    input: null,
    output: null,
  }

  // state.prog[state.prog[1]] = phase

  while (state.prog[state.ip] !== 99) {
    state = parseOpcode(state)

    if (state.opcode === 3) {
      if (src.length > 0) state.input = src.shift()
      else {
        await unblock()
        state.ip -= 1
        continue
      }
    }

    state = exec(state)

    if (state.opcode === 4) {
      trg.push(state.output)
    }
  }
}
