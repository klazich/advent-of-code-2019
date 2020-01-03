const op = 3
const n = 1

const fn = (state, log = false) => {
  const { ip, prog, input } = state

  const params = prog.slice(ip, ip + n)

  const target = params[0]

  prog[target] = input

  if (log) log('INPUT', ip, params, prog[ip - 1], op, [0])

  return {
    ...state,
    ip: ip + n,
    prog,
  }
}

export default { op, n, fn }
