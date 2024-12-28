import { useState } from 'react'
import classNames from 'classnames'

const FilePickerWindow = () => {
  const [filePath, setFilePath] = useState('')
  const [fileFullPath, setFileFullPath] = useState('')

  const openFilePicker = async () => {
    if (window.electronAPI) {
      const filePickerResult = await window.electronAPI.openFilePicker()
      const fileName = String(filePickerResult).split('/').pop()
      setFilePath(fileName)
      setFileFullPath(filePickerResult)
      await window.globalVariableHandler.setSharedData('fileFullPath', filePickerResult)
    } else {
      console.error('electronAPI is not defined on window')
    }
  }

  const [url, setUrl] = useState('')
  const [isValidUrl, setIsValidUrl] = useState(true)

  const handleUrlChange = (e) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    const urlPattern = /^https:\/\/.*\.json$/
    setIsValidUrl(urlPattern.test(newUrl))
  }

  const onGoButtonClicked = async () => {
    await window.windowAPI.closeFilePickerWindow();
  }

  return (
    <>
      <div className="text-3xl text-gray-900 font-bold py-4 text-gray-900 dark:text-gray-100">
        SELECT FILE TO LEARN
      </div>
      <div className="border-2 border-gray-300 dark:border-gray-700 rounded-lg p-10">
        <div className="border-2 border-gray-300 border-dotted dark:border-gray-700 rounded-lg p-10">
          <div className="text-1xl text-gray-900 font-bold py-4 text-gray-900 dark:text-gray-100">
            Select learning file from local storage
          </div>
          <button
            onClick={openFilePicker}
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Select
          </button>
          {filePath && (
            <div className="text-black dark:text-gray-100 mt-4">Selected file: {filePath}</div>
          )}
        </div>
        <div className="text-2xl text-gray-900 font-bold py-4 text-gray-900 dark:text-gray-100 m-5">
          OR
        </div>
        <div className="border-2 border-gray-800 border-dotted dark:border-gray-700 rounded-lg p-10">
          <div className="text-1xl text-gray-900 font-bold py-4 text-gray-900 dark:text-gray-100">
            Download learning file from internet
          </div>
          <input
            className={classNames(
              'text-1xl m-5 dark:bg-gray-800 focus:ring-gray-300 border-2 w-full',
              {
                'border-black': isValidUrl,
                'border-red-500': !isValidUrl
              }
            )}
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter URL (https://... .json)"
          />
          <br />
          {!isValidUrl && (
            <div className="text-red-500 mt-2">
              Invalid URL. Must start with https:// and end with .json
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onGoButtonClicked}
        className="m-6 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      >
        GO!
      </button>
    </>
  )
}

export default FilePickerWindow
