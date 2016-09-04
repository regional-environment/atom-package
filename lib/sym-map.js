'use strict'

const {iterator} = Symbol

function SymMap (iterable = '') {
  const ab = new Map()
  const ba = new Map()
  const self = {
    has: key => ab.has(key) || ba.has(key),
    get: key => (ab.has(key) ? ab : ba).get(key),
    set: (a, b) => set(a, b),
    delete: key => {
      deleteKey(key)
      return self
    },
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
    deleteKey(a)
    deleteKey(b)
    ab.set(a, b)
    ba.set(b, a)
    return self
  }
  function remove (key, ab, ba) {
    if (ab.has(key)) {
      ba.delete(ab.get(key))
      ab.delete(key)
      return true
    }
    return false
  }
  function deleteKey (key) {
    remove(key, ab, ba) || remove(key, ba, ab)
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
