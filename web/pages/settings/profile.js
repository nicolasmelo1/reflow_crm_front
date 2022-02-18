import React from 'react'
import { Layout, Profile } from '@shared/components'
import Header from '../../components/Header'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class ProfilePage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout header={<Header title={'Perfil'}/>}>
                <Profile/>
            </Layout>
        )
    }

    
}

export default ProfilePage