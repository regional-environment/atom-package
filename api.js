'use strict'

const EventEmitter = require('events')
const {TextEditor} = require('atom')
const {workspace} = global.atom

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
    workspace.onDidDestroyPaneItem(createPaneItemListener(emitCloseFile))
  )
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
