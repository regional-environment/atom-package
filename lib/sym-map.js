'use strict'

class SymMap extends Map {

  constructor (iterable) {
    super()
    for (const [a, b] of iterable) {
      this.set(a, b)
    }
  }

  set (a, b) {
    super.set(a, b)
    super.set(b, a)
  }

}

module.exports = SymMap
