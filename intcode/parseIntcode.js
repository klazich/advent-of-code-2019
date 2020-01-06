const parseIntcode = intcode =>
  new Proxy(
    intcode.reduce((m, v, i) => {
      m[i] = v
      return m
    }, {}),
    {
      get(target, prop, receiver) {
        if (prop === 'slice') {
          return (s, e) => {
            const values = []
            for (let i = s; i < e; i += 1) {
              values.push(Reflect.get(target, i, receiver))
            }
            return values
          }
        } else if (Reflect.has(target, prop)) {
          return Reflect.get(target, prop, receiver)
        } else {
          return 0
        }
      },
    }
  )

export default parseIntcode
