import input from '../input/day9'

// Day 9: Sensor Boost
// 1. 2789104029
// 2. 32869

import intMachine from '../intcode'

const main = async (code) => {
  const io = { in: [code], out: [] }
  const machine = intMachine(input)('A')

  await machine(io.in, io.out)

  console.log(io)
}

main(1)
main(2)
