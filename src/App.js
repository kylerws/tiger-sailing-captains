import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/useAuth'
import AuthScreen from './auth/AuthScreen'
import NavBar from './components/NavBar'
import Dashboard from './components/Dashboard'

import './styles/custom.scss'
import './styles/App.css'

// Main controller for app
export default function App() {
  return(
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute path="/dashboard" component={Main} componentProps={{}} />
          <Route path="/" render={(props) => <AuthScreen from={props.location} />} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

// PrivateRoute that requires auth
function PrivateRoute ({component: Component, componentProps, ...rest}) {
  let auth = useAuth();
  return (
    <Route
      {...rest}
      render={(props) => auth.user ?
        <Component {...props} {...componentProps} /> :
        <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}

// Controls the views for main
function Main() {
  return <>
    <NavBar />
    <Dashboard />
  </>
}
