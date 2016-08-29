'use strict'

const {CompositeDisposable} = require('atom')
const loader = require('./loader.js')

let subscriptions = null
let api = null

function activate () {
  subscriptions = new CompositeDisposable()
  api = require('./api.js').init({subscriptions})
  subscriptions.add(loader.activate(api))
}

function deactivate () {
  subscriptions.dispose()
  subscriptions = null
  api = null
  loader.deactivate(api)
}

module.exports = {
  activate,
  deactivate,
  get subscriptions () {
    return subscriptions
  },
  get api () {
    return api
  }
}
