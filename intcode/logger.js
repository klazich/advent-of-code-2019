export default id => (type, ip, params, opIns, opcode, modes) => {
  console.log(
    `[ID:${id.toString().padStart(2, ' ')}]`,
    `@${(ip - 1).toString().padStart(3, '0')} :`,
    `${[opIns, ...params].join(' ').padEnd(25, ' ')}`,
    `${type.padStart(9, ' ')} `,
    ...params.map((v, i) =>
      `${modes[i] === 0 ? '$' : modes[i] === 1 ? '=' : '>'}${v}`.padEnd(6, ' ')
    )
  )
}
