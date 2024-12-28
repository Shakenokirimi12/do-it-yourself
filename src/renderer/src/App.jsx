import { HashRouter, Route, Routes } from 'react-router-dom'
import MainWindow from './Windows/MainWindow/MainWindow'
import FilePickerWindow from './Windows/FilePicker/FilePickerWindow'
import LearningPage from './Windows/MainWindow/LearningPage'

function App() {
  return (
    <HashRouter>
      <Routes basename={window.location.pathname}>
        <Route path="/" element={<MainWindow />} />
        <Route path="fpick" element={<FilePickerWindow />} />
        <Route path="learn" element={<LearningPage />} />
        {/*
        <Route path="ques" element={<QuestionWindow />} />
        <Route path="connection_checker" element={<ConnectionChecker />} />
         */}
      </Routes>
    </HashRouter>
  )
}

export default App
