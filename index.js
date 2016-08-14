'use strict'

const {CompositeDisposable} = require('atom')

let subscriptions = null

function activate () {
  subscriptions = new CompositeDisposable()
}

function deactivate () {
  subscriptions.dispose()
  subscriptions = null
}

module.exports = {
  activate, deactivate,
  get subscriptions () {
    return subscriptions
  }
}
