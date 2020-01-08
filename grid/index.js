// class Grid {
//   // 42 x 26
//   map = Array.from({ length: 26 }, () => Array.from({ length: 42 }, () => ' '))
//   score = 0
//   ball = 0
//   paddle = 0

//   get(x, y) {
//     return this.map[y][x]
//   }

//   set(x, y, v) {
//     if (x === -1) this.score = v
//     else this.map[y][x] = v

//     if (v === 4) this.ball = x
//     if (v === 3) this.paddle = x
//   }

//   toString() {
//     const chars = { 0: ' ', 1: '█', 2: '■', 3: '━', 4: '' }
//     return [this.map.map(row => row.join('')).join('\n'), this.score].join('\n')
//   }
// }

const chars = { 0: ' ', 1: '█', 2: '■', 3: '━', 4: '' }

const grid = () => {
  const map = Array.from({ length: 26 }, () =>
    Array.from({ length: 42 }, () => ' ')
  )
  const score = null
  const paddle = null
  const ball = null
  const cb = null

  return {
    map,
    score,
    paddle,
    ball,
    cb,

    read(x, y) {
      return this.map[y][x]
    },

    write(x, y, v) {
      if (x === -1) this.score = v
      else this.map[y][x] = chars[v]
      if (v === 3) this.paddle = x
      if (v === 4) this.ball = x
    },

    toString() {
      // const chars = { 0: ' ', 1: '█', 2: '■', 3: '━', 4: '' }
      const tiles = this.map.map(row => row.join('')).join('\n')
      return tiles + `  ${this.score}`
    },
  }
}

const Grid = () => new Proxy(grid(), {
  set(target, p, value, receiver) {
    let success = Reflect.set(target, p, value, receiver)

    if(p === 'ball')
    return success
  }
})

export default Grid