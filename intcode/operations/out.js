import { value } from '.'

const op = 4
const n = 1

const fn = (state, log = false) => {
  const { modes, ip, prog } = state
  const val = value(state.prog)

  const params = prog.slice(ip, ip + n)

  const value1 = val(params[0], modes[0])

  if (log) log('OUTPUT', ip, params, prog[ip - 1], op, modes)

  return {
    ...state,
    ip: ip + n,
    output: value1,
  }
}

export default { op, n, fn }
