export default id => (type, ip, params, opIns, opcode, modes) => {
  console.log(
    `[ID:${id.toString().padStart(2, ' ')}]`,
    `@${(ip - 1).toString().padStart(3, '0')} :`,
    `${[opIns, ...params].join(' ').padEnd(18, ' ')}`,
    `${type.padStart(8, ' ')} `,
    ...params.map((v, i) => `${modes[i] === 0 ? '$' : '='}${v}`.padEnd(4, ' '))
  )
}
