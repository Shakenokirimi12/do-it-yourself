const MainWindow = () => {
  const openFilePickerWindow = () => window.windowAPI.openFilePickerWindow()

  return (
    <>
      <div className="text-3xl text-gray-900 font-bold py-4 text-gray-900 dark:text-gray-100">
        Just Do It Yourself
      </div>
      <a
        onClick={openFilePickerWindow}
        className={`
          text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 
          font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 
          dark:focus:ring-gray-700 dark:border-gray-700
        `}
      >
        Get Started!
      </a>
    </>
  )
}

export default MainWindow
