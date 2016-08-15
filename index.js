'use strict'

const {CompositeDisposable} = require('atom')

let subscriptions = null
let api = null

function activate () {
  subscriptions = new CompositeDisposable()
  api = require('./api.js').init({subscriptions})
}

function deactivate () {
  subscriptions.dispose()
  subscriptions = null
  api = null
}

module.exports = {
  activate, deactivate,
  get subscriptions () {
    return subscriptions
  },
  get api () {
    return api
  }
}
