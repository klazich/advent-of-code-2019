import { Duplex } from 'stream'

const handlers = Symbol('handlers')

const Queue = init => {
  const arr = init ? [init] : []

  arr[handlers] = []

  arr.observe = function(handler) {
    this[handlers].push(handler)
  }

  return new Duplex({
    readableObjectMode: true,
    writableObjectMode: true,

    read() {
      this.push(-1)
    },

    write(chunk, encoding, callback) {
      this.push(chunk)
      callback()
    },
  })
}

const queue = Queue(3)

queue.write(7)
console.log(queue.read())
console.log(queue.read())
queue.write(10)
queue.write(3)
console.log(queue.read())
console.log(queue.read())
console.log(queue.read())
queue.write(21)
console.log(queue.read())
console.log(queue.read())
