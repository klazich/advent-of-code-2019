import input from '../input/day21'

// Day 21: Springdroid Adventure
// 1. 19356081
// 2. 1141901823

const unblock = () => new Promise(setImmediate)

const next = async arr => {
  while (true) {
    if (arr.length > 0) return arr.shift()
    else await unblock()
  }
}

const toCode = iterable => {
  const arr = []
  for (let i = 0; i < iterable.length; i += 1) arr.push(iterable.charCodeAt(i))
  arr.push(10)
  return arr
}

import BuildIntcode from '../intcode'

// Reg: A B C D  T J

const Intcode = BuildIntcode(input)

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

const ASCII = (program = '') => async (type = 'WALK') => {
  const io = { A: [...toCode(program), ...toCode(type)], B: [] }

  const machine = Intcode('I', io.A, io.B)
  const display = Display(io.B)

  Promise.all([machine(), display()])
}

// ASCII(`NOT A J
// NOT J J
// AND B J
// AND C J
// NOT J J
// AND D J`)()

ASCII(`NOT C J
AND H J
NOT B T
OR T J
NOT A T
OR T J
AND D J`)('RUN')
