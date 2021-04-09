import React from 'react'
import { AuthProvider } from './auth/useAuth'
import AuthScreen from './auth/AuthScreen'
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard'

import './styles/custom.scss'
import './styles/App.css'

const App = () => {
  return (
    <AuthProvider>
      <AuthScreen>
        <NavBar />
        <Dashboard />
      </AuthScreen>
    </AuthProvider>
  );
}



export default App
