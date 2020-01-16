import input from '../input/day17'

// Day 17: Set and Forget
// 1. 8408
// 2. 1168948

const unblock = () => new Promise(setImmediate)

const next = async (arr, id) => {
  let t = 0
  while (true) {
    t += 1
    if (arr.length > 0) return arr.shift()
    else await unblock()
    if (t === 10000) console.log('WAITING', id ?? '')
  }
}

import Intcode from '../intcode'

input[0] = 2

const buildMachine = Intcode(input)

const genASCII = async function*() {
  const io = { A: [], B: [] }
  const ASCII = buildMachine('A', io.A, io.B)

  ASCII()

  while (true) {
    const take = await next(io.B)
    if (take === 'END') return
    yield take
  }
}

const buildScaffold = async gen => {
  let scaffold = ''
  for await (let code of gen) scaffold += String.fromCharCode(code)
  return scaffold
}

const intersections = scaffold => {
  const arr = scaffold.split('\n')
  const intersects = new Set()

  for (let i = 1; i < arr.length - 1; i += 1) {
    const row = arr[i]
    for (let j = 1; j < row.length - 1; j += 1) {
      if (
        [
          [0, 0],
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ].every(([k, l]) => arr[i + k][j + l] === '#')
      )
        intersects.add([i, j])
    }
  }

  return Array.from(intersects)
}

const alignmentParameters = scaffold =>
  intersections(scaffold).reduce((sum, [i, j]) => sum + i * j, 0)

const main1 = async () => {
  const scaffold = await buildScaffold(genASCII())
  console.log(alignmentParameters(scaffold))
}

// main1()

//  R,  6,  L,  10, R,  8,  R,  8,  R,  12, L,  8,  L,  10, R,  6,  L,  10, R,
//  8,  R,  8,  R,  12, L,  10, R,  6,  L,  10, R,  12, L,  8,  L,  10, R,  12,
//  L,  10, R,  6,  L,  10, R,  6,  L,  10, R,  8,  R,  8,  R,  12, L,  8,  L,
//  10, R,  6,  L, 10,  R,  8,  R,  8,  R,  12, L, 10,  R,  6,  L,  10

const toCode = iterable => {
  const arr = []
  for (let i = 0; i < iterable.length; i += 1) arr.push(iterable.charCodeAt(i))
  arr.push(10)
  return arr
}

const BotCom = () => (id, src, trg) => async () => {
  let map = ''

  while (true) {
    const code = await next(src, id)
    map += String.fromCharCode(code)
    if (map.slice(-6) === 'feed?\n') break
  }

  console.log(map)

  map = ''
  let line = 0
  while (true) {
    const code = await next(src, id)
    map += String.fromCharCode(code)

    if (code === 10) line += 1
    if (line === 41) {
      console.log(map)
      map = ''
      line = 0
    }

    if (code > 127) {
      trg.push(code)
      return
    }
  }
}

const instructions = (log = false) => {
  const [y, n] = [121, 110]
  const A = toCode('R,6,L,10,R,8,R,8')
  const B = toCode('R,12,L,8,L,10')
  const C = toCode('R,12,L,10,R,6,L,10')
  const MAIN = toCode('A,B,A,C,B,C,A,B,A,C')

  const stream = [MAIN, A, B, C, log ? y : n, 10].flat()

  return stream
}

const buildBotCom = BotCom()

const main = async () => {
  const io = { A: instructions(), B: [] }

  const ASCII = buildMachine('A', io.A, io.B)
  const botCom = buildBotCom('B', io.B, io.A)

  await Promise.all([botCom(), ASCII()])

  console.log(io)
}

main()
