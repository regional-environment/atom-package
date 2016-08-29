'use strict'

const {CompositeDisposable} = require('atom')

let subscriptions = null

function activate ({on}) {
  subscriptions = new CompositeDisposable(
    on('enter-file', filedesc => {}),
    on('leave-file', filedesc => {}),
    on('open-file', filedesc => {}),
    on('close-file', filedesc => {}),
    on('atom/enter-tab', editor => {}),
    on('atom/leave-tab', editor => {}),
    on('atom/open-tab', editor => {}),
    on('atom/close-tab', editor => {})
  )
}

function deactivate () {
  subscriptions.dispose()
  subscriptions = null
}

module.exports = {
  activate,
  deactivate,
  get subscriptions () {
    return subscriptions
  }
}
