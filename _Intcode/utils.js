export const enumerate = function*(iterable) {
  for (let i = 0; i < iterable.length; i += 1) yield [i, iterable[i]]
}

export const count = function*(start = 0) {
  let n = start
  while (true) yield n++
}

export const parseIntcodeInput = input =>
  new Proxy(
    input.reduce((map, v, i) => {
      map[i] = v // BigInt(v)
      return map
    }, {}),
    {
      get(target, p, receiver) {
        return p === 'slice'
          ? (s, e) => {
              const values = []
              for (let i = s; i < e; i += 1)
                values.push(Reflect.get(target, i, receiver))
              return values
            }
          : Reflect.has(target, p)
          ? Reflect.get(target, p, receiver)
          : 0
      },
    }
  )
