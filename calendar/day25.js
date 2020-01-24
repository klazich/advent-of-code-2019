import input from '../input/day25'

// Day 25: Cryostasis
// 1.
// 2.

const unblock = () => new Promise(setImmediate)

const next = async arr => {
  while (true) {
    if (arr.length > 0) return arr.shift()
    else await unblock()
  }
}

const Display = src => async () => {
  let str = ''
  while (true) {
    const code = await next(src)
    if (code === 10) {
      console.log(str)
      str = ''
    } else if (code > 127) {
      console.log(code)
    } else str += String.fromCharCode(code)
  }
}

import BuildIntcode from '../intcode'

const Intcode = BuildIntcode(input)

const processInput = (src, trg) => async () => {
  while (true) {
    const ins = await next(src)
    const stream = ins.split('').map(s => s.charCodeAt(0))
    trg.push(...stream, 10)
    console.log(src, trg)
  }
}

const BuildASCII = (id, src, trg) => async () => {
  const io = { in: [], out: [] }
  const computer = Intcode(id, io.in, io.out)
  const input = processInput(src, io.in)
  const output = Display(io.out)

  Promise.all([input(), output(), computer()])
}

const main = async () => {
  const io = {in: ['east', 'inv'], out: []}

  const droid = BuildASCII('D', io.in, io.out)

  await droid()
}

main()