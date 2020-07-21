import React from 'react'
import { View } from 'react-native'
import { Layout, Billing } from '@shared/components'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class BillingPage extends React.Component {
    constructor(props) {
        super(props)
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <Layout title={'Pagamento'}>
                <Billing/>
            </Layout>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default BillingPage