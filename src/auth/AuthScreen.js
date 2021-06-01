import React from 'react'
import { AmplifyAuthenticator, AmplifySignUp } from '@aws-amplify/ui-react'
import { Redirect } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AuthScreen = ({from}) => {
  let auth = useAuth()

  if (auth.loading) {
    console.log("Auth loading...")
    return <div>Loading...</div>
  }

  return !auth.user ? 
  (
    <AmplifyAuthenticator usernameAlias="email">
      <AmplifySignUp slot="sign-up" formFields={[
        {
          type: "username",
          label: "Email *"
        },
        {
          type: "password",
        },
        {
          type: "name",
          label: "Full Name *",
          placeholder: "Enter name",
          required: true,
        },
        {
          type: "phone_number",
          required: true
        }
      ]}></AmplifySignUp>

    </AmplifyAuthenticator>
  ) : <Redirect to={{pathname: '/dashboard', state: {from: from}}} />
}

export default AuthScreen