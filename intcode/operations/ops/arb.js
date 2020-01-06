import { value } from '..'

const op = 9
const n = 1

const fn = (state, log = false) => {
  const { modes, ip, prog } = state
  const val = value(state)

  const params = prog.slice(ip, ip + n)

  const value1 = Number(val(params[0], modes[0]))

  // state.rb += value1

  if (log) log('ADJRB', ip, params, prog[ip - 1], op, modes)

  return {
    ...state,
    ip: ip + n,
    rb: state.rb + value1,
    prog,
  }
}

export default { op, n, fn }