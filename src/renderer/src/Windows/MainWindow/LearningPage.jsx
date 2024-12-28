import { useEffect, useState } from 'react'
import LoadingPage from './LoadingPage'

const LearningPage = () => {
  let [fileFullPath, setFileFullPath] = useState('')
  let [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      let pickerResult = await window.globalVariableHandler.getSharedData('fileFullPath')
      setFileFullPath(pickerResult)
    }
    fetchData()
  }, [])
  return <div>{isLoading ? <LoadingPage /> : <a>Loaded!</a>}</div>
}

export default LearningPage
