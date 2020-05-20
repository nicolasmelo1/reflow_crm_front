import React from 'react'
import ChangePassword from '@shared/components/ChangePassword'
import Layout from '@shared/components/Layout'
import { withRouter } from 'next/router'
import { strings } from '@shared/utils/constants'

class ChangePasswordPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout title={strings['pt-br']['changePasswordPageTitle']} hideNavBar={true} isNotLogged={true}>
                <ChangePassword temporaryPassword={this.props.router?.query?.temp_pass}/>
            </Layout>
        )
    }
}


export default withRouter(ChangePasswordPage)
