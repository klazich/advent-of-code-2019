import readline from 'readline'

import input from '../input/day25'

// Day 25: Cryostasis
// 1. 1077936448
// 2.

import BuildIntcode from '../intcode'

const Intcode = BuildIntcode(input)

const unblock = () => new Promise(setImmediate)

const take = async arr => {
  while (true) {
    if (arr.length > 0) return arr.shift()
    else await unblock()
  }
}

const BuildASCII = (id, src, trg) => async () => {
  const io = { in: [], out: [] }

  const processInput = (src, trg) => async () => {
    while (true) {
      const ins = await take(src)
      const stream = ins.split('').map(s => s.charCodeAt(0))
      trg.push(...stream, 10)
    }
  }

  const processOutput = (src, trg) => async () => {
    let str = ''
    while (true) {
      const code = await take(src)
      if (code === 10) {
        trg.push(str)
        str = ''
      } else str += String.fromCharCode(code)
    }
  }

  const computer = Intcode(id, io.in, io.out)
  const input = processInput(src, io.in)
  const output = processOutput(io.out, trg)

  Promise.all([input(), output(), computer()])
}

const Droid = (id, src, trg) => async () => {
  const io = { in: [], out: [] }
  const history = []
  let t = 0

  const processInput = (src, trg) => async () => {
    while (true) {
      const input = await take(src)
      trg.push(input)
      history.push([++t, input])
    }
  }

  const processOutput = (src, trg) => async () => {
    while (true) {
      const line = await take(src)
      trg.push(line)
      if (line === 'Unrecognized command.') history.push([t, 'COMMAND FAILED'])
    }
  }

  const computer = BuildASCII(id, io.in, io.out)
  const input = processInput(src, io.in)
  const output = processOutput(io.out, trg)

  Promise.all([input(), output(), computer()])
}

const Display = src => async () => {
  while (true) {
    const line = await take(src)
    console.log(line)
  }
}

const InputCommand = trg => async () => {
  const rl = readline.createInterface({ input: process.stdin })
  for await (const line of rl) trg.push(line)
}

const main = async () => {
  const io = { in: [], out: [] }

  const droid = Droid('D', io.in, io.out)
  const display = Display(io.out)
  const input = InputCommand(io.in)

  await Promise.all([input(), droid(), display()])
}

main()
