// @ts-check

import input from '../input/Day8.js'

// Day 8: Space Image Format
// 1.
// 2.

// 25 pixels wide and 6 pixels tall

const co = function(genFn) {
  return function(...args) {
    let genObj = genFn(...args)
    genObj.next()
    return genObj
  }
}

const send = (iterable, receiver) => {
  for (let x of iterable) receiver.next()
  receiver.return()
}

const chunk = co(function*(n, receiver) {
  try {
    while (true) {
      let s = ''
      for (let i = 0; i < n; i += 1) s = `${s}${yield}`
    }
  } finally {
  }
})

const rows = (str, size) =>
  function*(trg) {
    const regex = RegExp(`.{1,${size}}`, 'g')
    console.log(regex)
    let m
    while ((m = regex.exec(str)) !== null) trg.next(m[0])
  }

const iterLayer = str => function*(width, height) {}
