import React from 'react'
import { Layout, Users } from '@shared/components'
import Header from '../../components/Header'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class UsersPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout header={<Header title={'Usuários'}/>}>
                <Users/>
            </Layout>
        )
    }
}

export default UsersPage