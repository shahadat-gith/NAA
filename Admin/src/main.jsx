import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { AdminContextProvider } from './context/AdminContext.jsx'
import { TeacherContextProvider } from './context/TeacherContext.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <AdminContextProvider>
      <TeacherContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </TeacherContextProvider>
    </AdminContextProvider>
  </HashRouter>
)
