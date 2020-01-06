import { value } from '..'

const op = 6
const n = 2

const fn = (state, log = false) => {
  const { modes, ip, prog } = state
  const val = value(state)

  const params = prog.slice(ip, ip + n)

  const value1 = Number(val(params[0], modes[0]))
  const value2 = Number(val(params[1], modes[1]))

  if (log) log('JUMPFALSE', ip, params, prog[ip - 1], op, modes)

  return {
    ...state,
    ip: value1 === 0 ? value2 : ip + n,
    prog,
  }
}

export default { op, n, fn }
