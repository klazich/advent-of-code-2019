import input from '../input/day23'

// Day 23: Category Six
// 1. 17849
// 2. 12235

const unblock = () => new Promise(setImmediate)

const next = async arr => {
  while (true) {
    if (arr.length > 0) return arr.shift()
    else await unblock()
  }
}

// const PacketQueue = init =>
//   new Proxy(init ? [init] : [], {
//     get(target, p, receiver) {
//       if (p === 'shift' && Reflect.get(target, 'length', receiver) < 1) {
//         return () => {
//           Reflect.set(target, 'length')
//         }
//       }
//       console.log(`[GET] prop ${p}, of`, target)
//       // if (Reflect.get(target, 'length', receiver) < 1) target.push(-1)
//       // console.log('AFTER ', target, p)
//       return Reflect.get(target, p, receiver)
//     },
//     set(target, p, value, receiver) {
//       console.log(`[SET] prop ${p} to ${value}, of`, target)
//       return Reflect.set(target, p, value, receiver)
//     }
//   })

const Network = getType =>
  new Proxy(
    {},
    {
      get(target, p, receiver) {
        if (!Reflect.has(target, p)) Reflect.set(target, p, getType(), receiver)
        return Reflect.get(target, p, receiver)
      },
    }
  )

const watch = async (network, address) => {
  let x, y, a, b
  while (true) {
    if (network[address].length > 0) {
      ;[x, y] = network[address][0]
      if (x !== a && y !== b)
        console.log(`@${address.toString().padStart(3, '0')}: x=${x} y=${y}`)
      ;[a, b] = [x, y]
    }
    await unblock()
  }
}

const handleInput = (id, network, input) => async () => {
  while (true) {
    // console.log(id, network[id], input)
    const packet = await next(network[id].queue)
    // console.log(id, packet)
    input.push(...packet)
  }
}

const handleOutput = (id, output, network) => async () => {
  while (true) {
    const address = await next(output)
    const packet = [await next(output), await next(output)]
    // console.log(id, packet, address)
    network[address].queue.push(packet)
  }
}

const isEmpty = async arr => arr.length < 1

const handleStatus = (id, network, io) => async () => {
  while (true) {
    const idleAddress = await isEmpty(network[id].queue)
    const idleInput = await isEmpty(io.input)
    const idleOutput = await isEmpty(io.output)
    network[id].idle = idleAddress && idleInput && idleOutput
    await unblock()
  }
}

import Intcode from '../intcode'

const Computer = Intcode(input)

const buildNIC = network => async id => {
  const io = {
    input: [id],
    output: [],
  }

  const machine = Computer(id, io.input, io.output)

  const input = handleInput(id, network, io.input)
  const output = handleOutput(id, io.output, network)
  const status = handleStatus(id, network, io)

  Promise.all([input(), output(), status(), machine()])
}

const main1 = async () => {
  const network = Network()
  const NIC = buildNIC(network)

  Promise.all([
    ...Array.from({ length: 50 }, (_, i) => NIC(i)),
    watch(network, 255),
  ])
}

const isIdle = network => Object.values(network).every(({ idle }) => idle)

const buildNAT = network => async (id = 255) => {
  network[id].idle = true
  let packet = null
  while (true) {
    while (network[id].queue.length > 0) packet = network[id].queue.shift()
    if (isIdle(network) && packet) {
      console.log('NETWORK IDLE')
      network[0].queue.push(Array.from(packet))
      console.log('PUSHED', packet)
      packet = null
    }
    await unblock()
  }
}

const main2 = async () => {
  const network = Network(() => ({ queue: [], idle: false }))

  const NIC = buildNIC(network)
  const NAT = buildNAT(network)

  Promise.all([...Array.from({ length: 50 }, (_, i) => NIC(i)), NAT(255)])
}

main2()
