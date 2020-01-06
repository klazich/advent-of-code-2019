import add from './ops/add'
import mul from './ops/mul'
import mov from './ops/mov'
import out from './ops/out'
import jnz from './ops/jnz'
import jez from './ops/jez'
import lsn from './ops/lsn'
import eql from './ops/eql'
import arb from './ops/arb'

// proxyLogger

export const value = ({prog, rb}) => (param, mode) => {
  if (mode === 0) return BigInt(prog[param])
  if (mode === 1) return BigInt(param)
  if (mode === 2) return BigInt(prog[rb + param])
}

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
    [arb.op]: arb.fn,
  }[state.opcode](state, logger))
