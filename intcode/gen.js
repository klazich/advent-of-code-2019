// @ts-check

/**
 * @param {Object<string, number>} obj
 * @param {number|string} k
 * @param {number} v
 */
const modify = (obj, k, v) => {
  obj[k] = v
  return obj
}

const execFn = (state, fn) => {
  const modes = state.modes
  
}

const add = x => y => z => state => modify(state, z, x + y)
const mul = x => y => z => state => modify(state, z, x * y)
const mov = x => state => modify(state, x, state.input)
const jnz = x => y => state => modify(state, 'ip', x !== 0 ? y : state.ip)
const jez = x => y => state => modify(state, 'ip', x === 0 ? y : state.ip)
const lsn = x => y => z => state => modify(state, z, x < y ? 1 : 0)
const eql = x => y => z => state => modify(state, z, x === y ? 1 : 0)

/**
 * @param {number} op
 * @returns {{fn: function, n: number}}
 */
const operation = op => {
  if (op === 1) return { fn: add, n: 3 }
  if (op === 2) return { fn: mul, n: 3 }
  if (op === 5) return { fn: jnz, n: 2 }
  if (op === 6) return { fn: jez, n: 2 }
  if (op === 7) return { fn: lsn, n: 3 }
  if (op === 8) return { fn: eql, n: 3 }
}

/**
 * @param {Object<string, number>} state
 */
const parseOpcode = state => {
  const opcodeIns = `${state[state.ip]}`
  const opcode = +opcodeIns.slice(-2)
  const modes = [...opcodeIns.slice(0, -2)].map(v => +v).reverse()
  return { opcode, modes }
}

/**
 * @param {Object} arg0
 * @param {Object<string, number>} arg0.state
 * @param {number} arg0.opcode
 * @param {number[]} arg0.modes
 */
const getParamsFn = ({ state, opcode, modes }) => {
  const { fn, n } = operation(opcode)
  const params = Array.from({ length: n }, () => state[state.ip++])
  return { state, params, modes, fn }
}

/**
 * @param {Object} arg0
 * @param {Object} arg0.state
 * @param {number} arg0.state.ip
 * @param {number[]} arg0.params
 * @param {number[]} arg0.modes
 * @param {function} arg0.fn
 */
const exec = ({ state, params, modes, fn }) =>
  params.reduce((f, v, i) => f((modes[i] ?? 0) === 0 ? state[v] : v), fn)(state)

/** @param {number[]} intcode */
const machine = intcode =>
  async function*(phase, trg) {
    const state = intcode.reduce(
      (m, v, i) => {
        m[i] = v
        return m
      },
      { ip: 2 }
    )

    state[state[1]] = phase

    let input

    while (state[state.ip] !== 99) {
      let { ip } = state
      const insConfig = state[ip++].toString()
      const opcode = +insConfig.slice(-2)
      const modes = [...insConfig.slice(0, -2)].map(v => +v).reverse()

      if (opcode === 99) break
      if (opcode === 3) input = yield
      if (opcode === 4)
        trg.next(modes[0] === 0 ? state[state[ip++]] : state[ip++])
    }
  }
