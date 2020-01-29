// @ts-check

import { parseIntcodeInput } from './utils'

const unblock = () => new Promise(setImmediate)

const take = async (arr, id) => {
  while (true) {
    if (arr.length > 0) return arr.shift()
    else await unblock()
  }
}

const parseOpcodeInstruction = instruction => {
  const opIns = instruction.toString().padStart(5, '0')
  const opcode = +opIns.slice(-2)
  const modes = [...opIns.slice(0, -2)].map(v => +v).reverse()
  return [opcode, modes]
}

const next = generatorObject => generatorObject.next().value

const Intcode = intcode => (src, trg) => async () => {
  const processedIntcode = parseIntcodeInput(intcode)
  const io = { in: [], out: [] }

  const pushData = (src, trg) => async () => {
    while (true) {
      const data = await take(src)
      trg.push(data)
      if (data === null) break
    }
  }

  let state = {
    memory: [],
    ip: 0,
    rb: 0,
  }
}

const parameterValue = ({ memory, rb }) => mode => (
  transform = x => BigInt(x)
) => param => {
  if (mode === 0) return transform(memory[param])
  if (mode === 1) return transform(param)
  if (mode === 2) return transform(memory[rb + param])
}

const parameterTarget = ({ rb }) => mode => (transform = x => x) => param => {
  if (mode === 2) return transform(param + rb)
  return transform(param)
}

const op1 = state => modes => {}

const exec = async (state, src, trg) => {
  let { memory, ip, rb } = state
  const [opcode, modes] = parseOpcodeInstruction(next())

  const operate = ({ memory, ip, rb }, input) => ({ sources }) => {
    let output
  }

  switch (opcode) {
    case 1: {
      // ip -> ip + 3
      // sources: p1 p2 p3
      // parameter:
      //   variables: p1 p2 -> v1 v2
      //   trans:     x => BigInt(mode(x))
      // target:
      //   variables: p3 -> t3
      //   trans:     x => t_mode(x)
      //   object:    state
      //   path:      /memory/t3
      // operation: 
      //   fn: v1 + v2 --> trg
    }
    case 2: {
      // ip -> ip + 3
      // sources: p1 p2 p3
      // parameter:
      //   variables: p1 p2 -> v1 v2
      //   trans:     x => BigInt(mode(x))
      // target:
      //   variables: p3 -> t3
      //   trans:     x => t_mode(x)
      //   object:    state
      //   path:      /memory/t3
      // operation: 
      //   fn: v1 * v2 --> trg
    }
    case 3: {
      // ip -> ip + 1
      // sources: input p1
      // parameter:
      //   variables: input -> v1
      //   trans:     x => await take(x)
      // target:
      //   variables: p1 -> t1
      //   trans:     x => t_mode(x)
      //   object:    state
      //   path:      /memory/t1
      // operation: 
      //   fn: v1 --> trg
    }
    case 4: {
      // ip -> ip + 1
      // sources: p1
      // parameter:
      //   variables: p1 -> v1
      //   trans:     x => Number(mode(x))
      // target:
      //   variables:
      //   trans:     
      //   object:    output
      //   path:      /
      // operation: 
      //   fn: v1 --> trg
    }
    case 5: {
      // ip -> ip + 2
      // sources: p1 p2 state.ip
      // parameter:
      //   variables: p1 p2 [state.ip] -> v1 v2 ip
      //   trans:     x => Number(mode(x))
      // target:
      //   variables:
      //   trans:     
      //   object:    state
      //   path:      /ip
      // operation: 
      //   fn: v1 !== 0 ? v2 : ip --> trg
    }
    case 6: {
      // ip -> ip + 2
      // sources: p1 p2 state.ip
      // parameter:
      //   variables: p1 p2 [state.ip] -> v1 v2 ip
      //   trans:     x => Number(mode(x))
      // target:
      //   variables:
      //   trans:     
      //   object:    state
      //   path:      /ip
      // operation: 
      //   fn: v1 === 0 ? v2 : ip --> trg
    }
    case 7: {
      // ip -> ip + 3
      // sources: p1 p2 p3
      // parameter:
      //   variables: p1 p2 -> v1 v2
      //   trans:     x => BigInt(mode(x))
      // target:
      //   variables: p3 -> t3
      //   trans:     x => t_mode(x)
      //   object:    state
      //   path:      /memory/t3
      // operation: 
      //   fn: v1 < v2 ? 1 : 0 --> trg
    }
    case 8: {
      // ip -> ip + 3
      // sources: p1 p2 p3
      // parameter:
      //   variables: p1 p2 -> v1 v2
      //   trans:     x => BigInt(mode(x))
      // target:
      //   variables: p3 -> t3
      //   trans:     x => t_mode(x)
      //   object:    state
      //   path:      /memory/t3
      // operation: 
      //   fn: v1 === v2 ? 1 : 0 --> trg
    }
    case 9: {
      // ip -> ip + 3
      // sources: p1 state.rb
      // parameter:
      //   variables: p1 [state.rb] -> v1 rb
      //   trans:     x => Number(mode(x))
      // target:
      //   variables: 
      //   trans:     
      //   object:    state
      //   path:      /rb
      // operation: 
      //   fn: rb + v1 --> trg

      // source ----> p1 state.rb
      // ip --------> +1
      // variables -> v1
      //   trans ---> x => Number(x)
      // operation -> rb + v1 => trg
      // target ----> state
      //   path ----> /rb (num)
    }
  }
}
