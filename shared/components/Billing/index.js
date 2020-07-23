import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import actions from '../../redux/actions'
import PaymentForm from './PaymentForm'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
class Billing extends React.Component {
    constructor(props) {
        super(props)
        this.cancelToken = axios.CancelToken
        this.source = null
        this.state = {
            isEditingPaymentData: true
        }
    }

    setIsEditingPayment = (data) => this.setState(state => ({...state, isEditingPaymentData: data}))

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div>
                {this.state.isEditingPaymentData ? (
                    <PaymentForm
                    cancelToken={this.cancelToken}
                    onGetAddressOptions={this.props.onGetAddressOptions}
                    setIsEditingPayment={this.setIsEditingPayment}
                    />
                ): (
                    <button onClick={e=> this.setIsEditingPayment(true)}>Configurar pagamento</button>
                )}
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login }), actions)(Billing)