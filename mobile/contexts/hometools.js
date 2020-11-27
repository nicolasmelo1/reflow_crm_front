import React from 'react'
import { createContext } from 'react'

const HomeToolsMenuContext  = createContext(null)
const withHomeToolsMenuContext = Component => (
    props => (
        <HomeToolsMenuContext.Consumer>
            {context => <Component homeToolsMenuContext={context} {...props} />}
        </HomeToolsMenuContext.Consumer>
    )
)

export { HomeToolsMenuContext, withHomeToolsMenuContext }