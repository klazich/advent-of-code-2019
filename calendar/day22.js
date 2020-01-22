import input from '../input/day22'

// Day 22: Slam Shuffle
// 1. 2519
// 2.

const pow = function(a, b, n) {
  a = a % n
  var result = BigInt(1)
  var x = a
  while (b > 0) {
    var leastSignificantBit = b % BigInt(2)
    b = b / BigInt(2)
    if (leastSignificantBit == BigInt(1)) {
      result = result * x
      result = result % n
    }
    x = x * x
    x = x % n
  }
  return result
}

const SIZE = BigInt(119315717514047)

const parseInput = input =>
  input.split('\n').map(s => {
    const n = BigInt(+(s.match(/-?\d+/) ?? [-1])[0])
    if (/new/g.test(s)) return [BigInt(0)]
    if (/cut/g.test(s)) return [BigInt(1), n >= BigInt(0) ? n : SIZE + n]
    if (/inc/g.test(s)) return [BigInt(2), n]
  })

// const ops = (len = SIZE) => (op, n) => id =>
//   [len - id - 1, id < n ? id + (len - n) : id - n, (id * n) % len][op]

// const exec = ins => ops()(...ins)

// const run = set => init => set.reduce((id, ins) => exec(ins)(id), init)

// console.log(run(parseInput(input))(2019))

// new deal:  new_start = (start - step) mod size
//            new_step  = -step mod size
// inc deal:  new_start = start
//            new_step  = (step * x) mod size = (step * n^(size-2)) mod size
// cut deal:  new_start = (start + step * n) mod size
//            new_step  = step

const transform = set => (str, stp, size) => {
  let start = str
  let step = stp

  for (let [type, n] of set) {
    if (type === BigInt(0)) {
      start = (start - step) % size
      step = -step % size
    }
    if (type === BigInt(1)) {
      step = (step * pow(n, size - BigInt(2), size)) % size
    }
    if (type === BigInt(2)) {
      start = (start + step * n) % size
    }
  }

  return [start, step]
}

// def repeat(start, step, size, repetitions):
//     final_step = pow(step, repetitions, size)
//     final_start = (start * (1 - final_step) * pow(1 - step, size - 2, size)) % size
//     return final_start, final_step

const repeat = reps => (start, step, size) => {
  const finalStep = pow(step, reps, size)
  const finalStart =
    (start *
      (BigInt(1) - finalStep) *
      pow(BigInt(1) - step, size - BigInt(2), size)) %
    size
  return [finalStart, finalStep]
}

// const SIZE = BigInt(119315717514047)
const REPS = BigInt(101741582076661)

const [start, step] = transform(parseInput(input))(BigInt(0), BigInt(1), SIZE)
const [finalStart, finalStep] = repeat(REPS)(start, step, SIZE)

const result = (finalStart + finalStep * BigInt(2020)) % SIZE

console.log(result)
console.log(parseInput(input))
