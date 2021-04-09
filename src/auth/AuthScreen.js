import React from 'react'
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react'

const AuthScreen = ({children}) => {
  return (
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
      ]}>
        
      </AmplifySignUp>
      <div className="App">
        {children}
        <AmplifySignOut />
      </div>
    </AmplifyAuthenticator>
  );
}

export default AuthScreen