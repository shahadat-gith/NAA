import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from 'react-router-dom'
import { FeeContextProvider } from './context/FeeContext.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FeeContextProvider>
      <AppContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>

      </AppContextProvider>

    </FeeContextProvider>

  </BrowserRouter>
)