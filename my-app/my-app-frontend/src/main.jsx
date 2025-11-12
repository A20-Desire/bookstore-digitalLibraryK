import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthProvider from './context/Authprovider.jsx'
import './i18n/index.js'


const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <AuthProvider>
        <div className="dark:bg-slate-900 dark:text-white">
          <App />
        </div>
      </AuthProvider>
    ),
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
