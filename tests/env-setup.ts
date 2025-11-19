/// <reference types="../src/types/web-ext.d.ts" />

import manifest from '../src/manifest.json'

void (function () {
  const MsgHandlers: ((a: any) => void)[] = []
  let StorageLocalData: Record<string, any> = {}

  ;(globalThis.browser as any) = {
    extension: {
      inIncognitoContext: false,
    },
    i18n: {
      getUILanguage: () => 'en_US',
    },
    bookmarks: {},
    commands: {
      cmds: [],
      getAll: () => Promise.resolve([]),
    },
    cookies: {},
    contextualIdentities: {},
    proxy: {
      onRequest: {},
    },
    permissions: {},
    runtime: {
      getURL: (path: string) => 'moz-extension://blablabla/' + path,
      sendMessage: (msg: any) => MsgHandlers.map(h => h(msg)),
      getManifest: () => manifest,
      onMessage: { addListener: (handler: any) => MsgHandlers.push(handler) },
    },
    sidebarAction: {
      setTitle: (conf: any) => {},
    },
    storage: {
      local: {
        data: {},
        set: (obj: {}) => {
          StorageLocalData = { ...StorageLocalData, ...obj }
          return Promise.resolve()
        },
        get: (key: any) => Promise.resolve({ [key]: StorageLocalData[key] }),
      },
      sync: {},
    },
    tabs: {
      create: () => Promise.resolve({}),
      captureTab: () => 'tab image',
    },
    windows: {},
  }
})()
