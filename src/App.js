import React from 'react'
import { AuthProvider } from './auth/useAuth'
import AuthScreen from './auth/AuthScreen'

const App = () => {
  return (
    <AuthProvider>
      <AuthScreen>

      </AuthScreen>
    </AuthProvider>
  );
}



export default App
