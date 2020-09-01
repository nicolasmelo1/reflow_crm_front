import React from 'react'
import { View } from 'react-native'
import { withAuthenticationContext } from '../contexts'
import { Layout, Company } from '@shared/components'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class CompanyPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout setIsAuthenticated={this.props.authenticationContext.setIsAuthenticated}>
                <Company/>
            </Layout>
        )
    }
}

export default withAuthenticationContext(CompanyPage)