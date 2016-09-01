'use strict'

const EventEmitter = require('events')
const {TextEditor} = require('atom')
const {workspace, project} = global.atom

const apiProto = {
  onEnterFile (fn) {
    return this.on('enter-file', fn)
  },
  onLeaveFile (fn) {
    return this.on('leave-file', fn)
  },
  onOpenFile (fn) {
    return this.on('open-file', fn)
  },
  onCloseFile (fn) {
    return this.on('close-file', fn)
  },
  addListener (...args) {
    return this.on(...args)
  },
  __proto__: null
}

function init ({subscriptions}) {
  const createEmitCaller = (tab, file) => (_editor = editor, _filedesc = filedesc) => {
    emitter.emit(tab, _editor)
    emitter.emit(file, _filedesc)
  }

  const createPaneItemListener = emit => paneitem =>
    paneitem instanceof TextEditor && emit(paneitem, createFileDescriptor(paneitem))

  const emitEnterFile = createEmitCaller('atom/enter-tab', 'enter-file')
  const emitLeaveFile = createEmitCaller('atom/leave-tab', 'leave-file')
  const emitOpenFile = createEmitCaller('atom/open-tab', 'open-file')
  const emitCloseFile = createEmitCaller('atom/close-tab', 'close-file')

  const projectpaths = new Set(project.getPaths())
  const onProjectDidChangePaths = paths => {
    emitter.emit('atom/did-change-path', [...paths])
    emitter.emit('change-projects', [...paths])
    const emit = (type, dirname) =>
      emitter.emit(type, {dirname, __proto__: null})
    for (const item of projectpaths) {
      if (!paths.has(item)) {
        projectpaths.delete(item)
        emit('remove-project', item)
      }
    }
    for (const item of paths) {
      if (!projectpaths.has(item)) {
        projectpaths.add(item)
        emit('add-project', item)
      }
    }
  }

  const emitter = new EventEmitter()
  let editor = null
  let filedesc = null

  subscriptions.add(
    workspace.onDidChangeActivePaneItem(paneitem => {
      emitLeaveFile()
      if (paneitem instanceof TextEditor) {
        editor = paneitem
        filedesc = createFileDescriptor(editor)
        emitEnterFile()
      }
    }),
    workspace.onDidAddPaneItem(createPaneItemListener(emitOpenFile)),
    workspace.onDidDestroyPaneItem(createPaneItemListener(emitCloseFile)),
    project.onDidChangePaths(onProjectDidChangePaths)
  )

  const createApiDisposable = (...args) => ({
    dispose () {
      api.removeListener(...args)
    },
    __proto__: api
  })

  const api = {
    on (type, fn) {
      emitter.on(type, fn)
      return createApiDisposable(api)
    },
    once (type, fn) {
      const disposable = api.on(type, (...args) => {
        disposable.dispose()
        fn(...args)
      })
      return disposable
    },
    emit (...args) {
      emitter.emit(...args)
      return createApiDisposable(api)
    },
    atom: {emitter},
    __proto__: apiProto
  }

  return api
}

function createFileDescriptor (editor) {
  const grammar = editor.getGrammar()
  return {
    filename: editor.getPath(),
    encoding: editor.getEncoding(),
    grammar: {
      name: grammar.name,
      scope: grammar.scopeName,
      __proto__: null
    },
    __proto__: null
  }
}

module.exports = {init}
