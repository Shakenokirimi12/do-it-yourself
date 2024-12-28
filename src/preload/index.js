import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

contextBridge.exposeInMainWorld('windowAPI', {
  openFilePickerWindow: async () => {
    try {
      return await ipcRenderer.invoke('openFilePickerWindow')
    } catch (error) {
      console.error('Failed to open file picker window:', error)
    }
  },
  closeFilePickerWindow: async () => {
    try {
      await ipcRenderer.invoke('closeFilePickerWindow')
    } catch (error) {
      console.error('Failed to open file picker window:', error)
    }
  }
})

contextBridge.exposeInMainWorld('electronAPI', {
  openFilePicker: async () => {
    try {
      const result = await ipcRenderer.invoke('openFilePicker')
      return result.filePaths
    } catch (error) {
      console.error('Failed to open file picker window:', error)
    }
  }
})

contextBridge.exposeInMainWorld('globalVariableHandler', {
  setSharedData: async (key, value) => {
    try {
      await ipcRenderer.invoke('set-shared-data', key, value)
    } catch (error) {
      console.error(`Failed to set shared data for key ${key}:, error`)
    }
  },
  getSharedData: async (key) => {
    try {
      return await ipcRenderer.invoke('get-shared-data', key)
    } catch (error) {
      console.error(`Failed to get shared data for key ${key}:, error`)
    }
  },
  resetSharedData: async () => {
    await ipcRenderer.invoke('reset-shared-data')
  }
})
