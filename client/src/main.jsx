import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter as Router } from 'react-router-dom'
import { FeeContextProvider } from './context/FeeContext.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <FeeContextProvider>
      <AppContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>

      </AppContextProvider>

    </FeeContextProvider>

  </Router>,
)