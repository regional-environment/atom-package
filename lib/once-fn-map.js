'use strict'

class OnceFunctionMap extends WeakMap {
  constructor (iterable = '') {
    super()
    for (const fn of iterable) {
      this.get(fn)
    }
  }

  get fn () {
    return fn => this.get(fn)
  }

  get (fn) {
    if (super.has(fn)) {
      return super.get(fn)
    }
    const value = fn()
    super.set(fn, value)
    return value
  }

  get set () {
    return this.get
  }

  static create (iterable) {
    return new OnceFunctionMap(iterable)
  }
}

module.exports = OnceFunctionMap
