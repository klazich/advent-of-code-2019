import { value } from '.'

const op = 7
const n = 3

const fn = (state, log = false) => {
  const { modes, ip, prog } = state
  const val = value(state.prog)

  const params = prog.slice(ip, ip + n)

  const value1 = val(params[0], modes[0])
  const value2 = val(params[1], modes[1])
  const target = params[2]

  prog[target] = value1 < value2 ? 1 : 0

  if (log) log('LESSTHAN', ip, params, prog[ip - 1], op, modes)

  return {
    ...state,
    ip: ip + n,
    prog,
  }
}

export default { op, n, fn }
