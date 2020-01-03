import add from './add'
import mul from './mul'
import mov from './mov'
import out from './out'
import jnz from './jnz'
import jez from './jez'
import lsn from './lsn'
import eql from './eql'

export const value = prog => (param, mode) =>
  mode === 0 ? prog[param] : param

export const parseOpcode = state => {
  const { ip, prog } = state

  const opIns = prog[ip].toString().padStart(5, '0')
  const opcode = +opIns.slice(-2)
  const modes = [...opIns.slice(0, -2)].map(v => +v).reverse()

  return {
    ...state,
    ip: ip + 1,
    opcode,
    modes,
  }
}

export const exec = (state, logger) =>
  ({
    [add.op]: add.fn,
    [mul.op]: mul.fn,
    [mov.op]: mov.fn,
    [out.op]: out.fn,
    [jnz.op]: jnz.fn,
    [jez.op]: jez.fn,
    [lsn.op]: lsn.fn,
    [eql.op]: eql.fn,
  }[state.opcode](state, logger))
