const unblock = () => new Promise(setImmediate)

const pipe = (...fns) => init => fns.reduce((x, f) => f(x), init)

const modify = (obj, k, v) => {
  obj[k] = v
  return obj
}

const parseIntcode = intcode =>
  intcode.reduce((o, v, i) => modify(o, i, v), { IP: 0 })

const getIpPoint = state => state[state.IP]
const incIP = state => modify(state, 'IP', state.IP + 1)
const setINS = state => modify(state, 'INS', getIpPoint(state))

const nextINS = pipe(setINS, incIP)

const iterModes = iterable => {
  const iter = (function*() {
    for (let e of iterable) yield e
    while (true) yield 0
  })()
  return () => iter.next().value
}

const setOPCODE = state =>
  modify(state, 'OPCODE', +state.INS.toString().slice(-2))
const setMODES = state =>
  modify(
    state,
    'MODES',
    iterModes([...state.INS.toString().slice(0, -2)].map(v => +v).reverse())
  )

const nextOP = pipe(setOPCODE, setMODES, nextINS)

const add = x => y => z => state => modify(state, z, x + y)
const mul = x => y => z => state => modify(state, z, x * y)
const jnz = x => y => state => modify(state, 'IP', x !== 0 ? y : state.IP)
const jez = x => y => state => modify(state, 'IP', x === 0 ? y : state.IP)
const lsn = x => y => z => state => modify(state, z, x < y ? 1 : 0)
const eql = x => y => z => state => modify(state, z, x === y ? 1 : 0)

const operation = op => {
  if (op === 1) return { fn: add, n: 3 }
  if (op === 2) return { fn: mul, n: 3 }
  if (op === 5) return { fn: jnz, n: 2 }
  if (op === 6) return { fn: jez, n: 2 }
  if (op === 7) return { fn: lsn, n: 3 }
  if (op === 8) return { fn: eql, n: 3 }
}

const setPARAM = state =>
  modify(state, 'PARAM', state.MODES() === 0 ? state[state.INS] : state.INS)

const nextPARAM = pipe(setPARAM, nextINS)

const runFn = ({ fn, n }) => state =>
  Array.from({ length: n }, () => nextPARAM(state).PARAM).reduce(
    (f, x) => f(x),
    fn
  )(state)

const exec = state => runFn(operation(state.OPCODE))(state)

const intMachine = intcode => async (src, trg) => {
  let state = parseIntcode(intcode)

  

  while (getIpPoint(state) !== 99) {
    state = nextOP(state)

    if (state.OPCODE === 3) {
      // if (src.length > 0)
    }
  }
}

intMachine([3, 8, 1001, 8, 10, 8, 105, 1, 0, 0])()
