import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import actions from '@shared/redux/actions'
import { Layout, Notification } from '@shared/components'

class Notifications extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Layout title={'Notificações / Reflow'}>
                <Notification/>
            </Layout>
        )
    }
}

export default connect(state => ({ login: state.login} ), actions)(withRouter(Notifications)) 