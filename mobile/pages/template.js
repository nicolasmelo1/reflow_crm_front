import React from 'react'
import { Layout, Templates } from '@shared/components'
import { withAuthenticationContext } from '../contexts'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class TemplatePage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout setIsAuthenticated={this.props.authenticationContext.setIsAuthenticated}>
                <Templates isEditing={true}/>
            </Layout>
        )
    }
}

export default withAuthenticationContext(TemplatePage)