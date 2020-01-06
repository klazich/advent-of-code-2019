import { value } from '..'

const op = 3
const n = 1

const fn = (state, log = false) => {
  const { modes, ip, prog, input } = state
  const val = value(state)

  const params = prog.slice(ip, ip + n)

  const target = modes[0] === 2 ? params[0] + state.rb : params[0]

  prog[target] = input

  if (log) log('INPUT', ip, params, prog[ip - 1], op, modes)

  return {
    ...state,
    ip: ip + n,
    prog,
  }
}

export default { op, n, fn }
