import React from 'react'
import { createContext } from 'react'

const AuthenticationContext  = createContext(null)
const withAuthenticationContext = Component => (
    props => (
        <AuthenticationContext.Consumer>
            {context => <Component authenticationContext={context} {...props} />}
        </AuthenticationContext.Consumer>
    )
)

export { AuthenticationContext, withAuthenticationContext }