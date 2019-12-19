import input from '../input/day4'

// Day 4: Secure Container
// 1. 1625
// 2. 1111

// 171309 - 643603

const s = n => `${n}`

const isSixDigits = n => s(n).length === 6
const hasDouble = n => /(\d)\1/.test(s(n))
const isIncrease = n =>
  [...s(n)].every((v, i, a) => (i === 0 ? true : +v >= +a[i - 1]))

const testTo = conditions => v => conditions.every(fn => fn(v))

const conditionalValuesInRange = function*([x, y], conditions) {
  const test = testTo(conditions)
  for (let i = x; i < y; i += 1) if (test(i)) yield i
}

const countIterableElements = iterable => [...iterable].length

const iter = conditionalValuesInRange(input, [
  isSixDigits,
  hasDouble,
  isIncrease,
])

console.log(countIterableElements(iter))

const hasExactDouble = n =>
  (s(n).match(/(\d)\1+/g) || []).filter(s => s.length === 2).length > 0

const iter2 = conditionalValuesInRange(input, [
  isSixDigits,
  hasExactDouble,
  isIncrease,
])

console.log(countIterableElements(iter2))
