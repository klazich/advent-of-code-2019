import { parseIntcodeInput } from './utils'
import Duplex from 'stream'

const parameterValue = ({ memory, rb }) => (param, mode) => {
  if (mode === 0) return BigInt(memory[param])
  if (mode === 1) return BigInt(param)
  if (mode === 2) return BigInt(memory[rb + param])
}

const parseOpcodeInstruction = state => {
  const { memory, ip } = state

  const instruction = memory[ip].toString().padStart(5, '0')

  const opcode = +instruction.slice(-2)
  const modes = [...instruction.slice(0, -2)].map(v => +v).reverse()

  return [{ ...state, ip: ip + 1 }, opcode, modes]
}

const Intcode = input => async () => {
  const processedInput = parseIntcodeInput(input)

  const io = { in: [], out: [] }

  const state = {
    memory: [],
    ip: 0,
    rb: 0,
  }

  async function* generate() {}
}

let range = {
  from: 1,
  to: 5,

  // for await..of calls this method once in the very beginning
  [Symbol.asyncIterator]() {
    // (1)
    // ...it returns the iterator object:
    // onward, for await..of works only with that object,
    // asking it for next values using next()
    return {
      current: this.from,
      last: this.to,

      // next() is called on each iteration by the for await..of loop
      async next() {
        // (2)
        // it should return the value as an object {done:.., value :...}
        // (automatically wrapped into a promise by async)

        // can use await inside, do async stuff:
        await new Promise(resolve => setTimeout(resolve, 1000)) // (3)

        if (this.current <= this.last) {
          return { done: false, value: this.current++ }
        } else {
          return { done: true }
        }
      },
    }
  },
}

;(async () => {
  for await (let value of range) {
    // (4)
    alert(value) // 1,2,3,4,5
  }
})()

let handlers = Symbol('handlers')

function makeObservable(target) {
  // 1. Initialize handlers store
  target[handlers] = []

  // Store the handler function in array for future calls
  target.observe = function(handler) {
    this[handlers].push(handler)
  }

  // 2. Create a proxy to handle changes
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let success = Reflect.set(...arguments) // forward the operation to object
      if (success) {
        // if there were no error while setting the property
        // call all handlers
        target[handlers].forEach(handler => handler(property, value))
      }
      return success
    },
  })
}

let user = {}

user = makeObservable(user)

user.observe((key, value) => {
  alert(`SET ${key}=${value}`)
})

user.name = 'John'
