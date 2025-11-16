import { RouterProvider, createBrowserRouter } from 'react-router-dom'

interface AppProps {
  router: ReturnType<typeof createBrowserRouter>;
}

function App({ router }: AppProps) {
  return (
    <RouterProvider router={router} />
  )
}

export default App
