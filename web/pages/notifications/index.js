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
                <Notification notifications={[
                    {
                        notification: 'teste {{ 1 }} teste'
                    }, 
                    {
                        notification: 'teste {{ 2 }} sei la'
                    },
                ]}/>
            </Layout>
        )
    }
}

export default connect(state => ({ login: state.login} ), actions)(withRouter(Notifications)) 