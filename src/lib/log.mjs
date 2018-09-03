/* eslint-disable no-console */
import util from 'util'


export const error = (name, ...values) => console.error(name, ...values)

export const debug = (name, ...values) => console.info(name, ...values)

export const print = (name, value) => console.log(
  name,
  util.inspect(value, { colors: true, depth: null })
)
