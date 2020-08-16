import React from 'react'
import ChangePassword from '@shared/components/ChangePassword'
import Layout from '@shared/components/Layout'
import { paths } from '@shared/utils/constants'
import { withAuthenticationContext } from '../contexts'
import { Linking } from 'expo'

class ChangePasswordPage extends React.Component {
    constructor(props) {
        super(props)
    }

    goBack = () => {
        if (this.props.authenticationContext) {
            Linking.openURL(Linking.makeUrl(paths.login().asUrl))
        }
    }

    render() {
        return (
            < setIsAuthenticated={this.props.authenticationContext.setIsAuthenticated} hideNavBar={true} isNotLogged={true}>
                <ChangePassword temporaryPassword={this.props.route?.params?.temp_pass} goBack={this.goBack}/>
            </Layout>
        )
    }
}


export default withAuthenticationContext(ChangePasswordPage)