import input from '../input/day2'

// Day 2: 1202 Program Alarm
// 1. 3101878
// 2. 8444

const add = (x, y) => x + y
const mul = (x, y) => x * y

const main = init => (noun, verb) => {
  let code = init
  ;[code[1], code[2]] = [noun, verb]
  let ip = 0
  while (code[ip] !== 99) {
    const [opCode, p1, p2, p3] = code.slice(ip, ip + 4)
    const [v1, v2] = [code[p1], code[p2]]
    code[p3] = {
      1: add,
      2: mul,
    }[opCode](v1, v2)
    ip += 4
  }
  return code
}

const result = main([...input])(12, 2)
console.log(result[0])

for (let i = 0; i < 100; i += 1) {
  let r
  for (let j = 0; j < 100; j += 1) {
    r = main([...input])(i, j)
    if (r[0] === 19690720) console.log(i, j)
  }
}
