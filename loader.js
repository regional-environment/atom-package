'use strict'

const {readdir, readFile, statSync} = require('fs')
const {arch, platform} = require('process')
const {CompositeDisposable} = require('atom')
const regenv = require('regional-environment')
const SymMap = require('./lib/sym-map.js')

const OPTIONAL_ENV_CONFIG = ['atom', arch, platform]

const envcfgdesc = required => ({
  required: ['config', ...required],
  optional: OPTIONAL_ENV_CONFIG,
  __proto__: null
})

const items = (dirname, required) =>
  regenv.loadItems(dirname, envcfgdesc(required))

function activate ({on, notifications}) {
  const fileplugset = new Set()
  const projplugset = new Set()
  const fileplugmap = new SymMap()
  const projplugmap = new SymMap()
  return new CompositeDisposable(
    on('enter-file', filedesc => {}),
    on('leave-file', filedesc => {}),
    on('open-file', filedesc => {}),
    on('close-file', filedesc => {}),
    on('change-projects', projectdescset => {}),
    on('add-project', projectdesc => {
      const {dirname} = projectdesc
      readdir(dirname, (error, list) => {
        if (error) {
          notifications.addError('Load project failed', {
            detail: `Can't access "${dirname}" as a directory`
          })
          return
        }
        for (const plugin of loadEnvConfig(dirname)) {
          projplugset.add(plugin)
          projplugmap.set(plugin, dirname)
        }
      })
    }),
    on('remove-project', projectdesc => {}),
    on('atom/enter-tab', editor => {}),
    on('atom/leave-tab', editor => {}),
    on('atom/open-tab', editor => {}),
    on('atom/close-tab', editor => {}),
    on('atom/did-change-path', projectpaths => {})
  )
}

function deactivate () {}

function enable () {}

function disable () {}

function loadEnvConfig (dirname) {
  items(dirname, ['js']) // do something more...
  items(dirname, ['json']) // do something more...
}

module.exports = {
  activate,
  deactivate,
  enable,
  disable,
  loadEnvConfig
}
