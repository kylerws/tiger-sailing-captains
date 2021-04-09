import React, { useState, useEffect, useContext, createContext } from 'react'
import { Auth, Hub } from 'aws-amplify';

// Auth context
const authContext = createContext();

// Provider component that wraps app
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components
export const useAuth = () => {
  return useContext(authContext);
}

// Provider hook that creates auth object, handles state, and wraps methods
function useProvideAuth() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState()
  // const [authState, setAuthState] = useState()
  
  // Sign in user with credentials
  
  const listenOnAuth = (data) => {
    switch (data.payload.event) {
      case 'signIn':
        console.log("signed in")
        console.log(data.payload.message)
        setUser(data.payload.data)
        break
      case 'signUp':
        console.log("signed up")
        console.log(data.payload)
        break
      case 'signOut':
        console.log("signed out")
        setUser()
        break
      case 'signInFailure':
        console.log(data.payload.message)
        break
      case 'forgotPasswordSubmit':
        console.log("Password changed successfully")
        break
      default:
        console.log("Unhandled auth case:")
        console.log(data.payload)
    }
  }

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(setUser)
      .catch(console.log)
      .then(() => setLoading(false))

    Hub.listen('auth', listenOnAuth)

    return () => Hub.remove('auth', listenOnAuth)
  }, []);

  // Get current user on page reload or authToken change
  useEffect(() => {(async () => {
    console.log(user)
  })() }, [user]); 

  return {
    loading,
    user
  }
}