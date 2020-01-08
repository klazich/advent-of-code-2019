import input from '../input/day12'

// Day 12: The N-Body Problem
// 1. 12466
// 2. 360689156787864

const N = 1000

const velChanges = arr =>
  arr.map(v => arr.reduce((a, c) => a + (c > v ? 1 : c < v ? -1 : 0), 0))

const updateVel = moons => {
  for (let prop in moons.pos)
    moons.vel[prop] = velChanges(moons.pos[prop]).map(
      (v, i) => moons.vel[prop][i] + v
    )
  return moons
}

const updatePos = moons => {
  for (let prop in moons.vel)
    moons.pos[prop] = moons.vel[prop].map((v, i) => moons.pos[prop][i] + v)
  return moons
}

const pipe = (...fns) => init => fns.reduce((x, f) => f(x), init)

const step1 = pipe(updateVel, updatePos)

const energy = arr => arr.reduce((a, c) => a + Math.abs(c), 0)

const totalEnergy = moons => {
  const { pos, vel } = moons

  let total = 0
  for (let i = 0; i < moons.pos.x.length; i += 1) {
    const p = energy([pos.x[i], pos.y[i], pos.z[i]])
    const k = energy([vel.x[i], vel.y[i], vel.z[i]])
    total += p * k
  }

  return total
}

const main1 = moons => n => {
  let state = moons
  for (let i = 0; i < n; i += 1) state = step1(state)
  console.log(totalEnergy(state))
}

// main1(input)(1000)

const { pos, vel } = input
const X = { pos: pos.x, vel: vel.x }
const Y = { pos: pos.y, vel: vel.y }
const Z = { pos: pos.z, vel: vel.z }

const updateVelDim = dim => {
  const { pos, vel } = dim
  dim.vel = velChanges(pos).map((v, i) => vel[i] + v)
  return dim
}

const updatePosDim = dim => {
  const { pos, vel } = dim
  dim.pos = vel.map((v, i) => pos[i] + v)
  return dim
}

const step = pipe(updateVelDim, updatePosDim)

const toString = ({ pos, vel }) => `${pos.join(',')},${vel.join(',')}`

const findCycle = async (id, init) => {
  const check = toString(init)
  let state = init
  let n = 0
  while (true) {
    n += 1
    state = step(state)
    if (toString(state) === check) break
  }
  console.log(id, n)
}

const main = async (x, y, z) => {
  await Promise.all([findCycle('x', x), findCycle('y', y), findCycle('z', z)])
}

main(X, Y, Z)

// x 186028
// y 286332
// z 108344

const gdc = (a, b) => (b ? gdc(b, a % b) : a)

const lcm = (a, b) => Math.abs(a * b) / gdc(a, b)

const lcmArr = arr => arr.reduce((a, c) => lcm(a, c))

console.log(lcmArr([186028, 286332, 108344]))
