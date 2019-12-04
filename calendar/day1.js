import input from '../input/day1'

// Day 1: The Tyranny of the Rocket Equation
// 1. 3330521
// 2. 4992931

const sum = arr => arr.reduce((a, v) => a + v, 0)

const fuel = mass => Math.floor(mass / 3) - 2

const result1 = sum(input.map(fuel))

console.log(result1)

const amortizedFuel = mass => {
  let total = 0
  let next = mass
  while ((next = fuel(next)) > 0) total += next
  return total
}

const result2 = sum(input.map(amortizedFuel))

console.log(result2)
