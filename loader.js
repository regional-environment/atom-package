'use strict'

const {CompositeDisposable} = require('atom')

function activate ({on}) {
  return new CompositeDisposable(
    on('enter-file', filedesc => {}),
    on('leave-file', filedesc => {}),
    on('open-file', filedesc => {}),
    on('close-file', filedesc => {}),
    on('add-project', projectdesc => {}),
    on('remove-project', projectdesc => {}),
    on('atom/enter-tab', editor => {}),
    on('atom/leave-tab', editor => {}),
    on('atom/open-tab', editor => {}),
    on('atom/close-tab', editor => {}),
    on('atom/did-change-path', projectpaths => {})
  )
}

function deactivate () {}

module.exports = {
  activate,
  deactivate
}
