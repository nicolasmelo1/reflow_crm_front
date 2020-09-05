import React from 'react'
import { View } from 'react-native'
import { Layout, Billing } from '@shared/components'
import Header from '../../components/Header'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class BillingPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
            <Layout title={'Pagamento'}>
                <Header title={'Pagamento'}/>
                <Billing/>
            </Layout>
        )
    }
}

export default BillingPage