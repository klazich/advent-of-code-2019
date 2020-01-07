import input from '../input/day12'

// Day 12: The N-Body Problem
// 1.
// 2.

//  x= -4   y= -14  z= 8
//  x= 1    y= -8   z= 10
//  x= -15  y= 2    z= 1
//  x= -17  y= -17  z= 16

const N = 1000

const combos = function*(iterable, c = []) {
  if (iterable.length === 0) yield c
  for (let i = 0; i < iterable.length; i += 1) {
    yield* combos(
      iterable.filter((_, j) => j !== i),
      [...c, iterable[i]]
    )
  }
}

const pairs = function*(iterable) {
  if (iterable.length === 1) return
  const head = iterable[0]
  const rest = iterable.slice(1)
  for (let e of rest) yield [head, e]
  yield* pairs(rest)
}

const moon = (px, py, pz) => (vx = 0, vy = 0, vz = 0) => ({
  pos: { x: px, y: py, z: pz },
  vel: { x: vx, y: vy, z: vz },
})

const updateVel = moon => (velocities) => {}