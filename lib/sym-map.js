'use strict'

const {iterator} = Symbol

function SymMap (iterable = '') {
  const ab = new Map()
  const ba = new Map()
  const self = {
    has: key => ab.has(key) || ba.has(key),
    get: key => (ab.has(key) ? ab : ba).get(key),
    set,
    * ab () {
      yield * ab
    },
    * ba () {
      yield * ba
    },
    __proto__: this
  }
  for (const [a, b] of iterable) {
    set(a, b)
  }
  return self
  function set (a, b) {
    ab.delete(ba.get(b))
    ba.delete(ab.get(a))
    ab.set(a, b)
    ba.set(b, a)
    return self
  }
}

module.exports = class extends SymMap {
  * entries () {
    yield * this
  }
  * [iterator] () {
    yield * this.ab()
  }
}
