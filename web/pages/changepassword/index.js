import React from 'react'
import Header from '../../components/Header'
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
            <Layout 
            hideNavBar={true} 
            isNotLogged={true} 
            header={<Header title={strings['pt-br']['changePasswordPageTitle']}/>}
            >
                <ChangePassword temporaryPassword={this.props.router?.query?.temp_pass}/>
            </Layout>
        )
    }
}


export default withRouter(ChangePasswordPage)
