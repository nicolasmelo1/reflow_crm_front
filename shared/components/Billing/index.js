import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import actions from '../../redux/actions'
import PaymentForm from './PaymentForm'
import ChargeForm from './ChargeForm'
import CompanyForm from './CompanyForm'

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
            addressOptions: [],
            isCompanyFormOpen: false,
            isChargeFormOpen: false, 
            isPaymentFormOpen: false
        }
    }

    setIsChargeFormOpen = () => this.setState(state => ({ ...state, isChargeFormOpen: !state.isChargeFormOpen }))

    setIsPaymentFormOpen = () => this.setState(state => ({...state, isPaymentFormOpen: !state.isPaymentFormOpen }))

    setIsCompanyFormOpen = () => this.setState(state => ({...state, isCompanyFormOpen: !state.isCompanyFormOpen }))

    setAddressOptions = (data) => this.setState(state => ({...state, addressOptions: data}))

    componentDidMount = () => {
        this.source = this.cancelToken.source()
        this.props.onGetPaymentData(this.source)
        this.props.onGetAddressOptions(this.source).then(response => {
            if (response && response.status === 200) {
                this.setAddressOptions(response.data.data)
            }
        })

    }
    
    componentWillUnmount = () => {
        if (this.source) {
            this.source.cancel()
        }
    }

    renderMobile = () => {
        return (
            <View></View>
        )
    }

    renderWeb = () => {
        return (
            <div style={{ overflowY: 'auto', height: 'calc(var(--app-height) - 100px)' }}>
                <button 
                style={{ borderTop: '1px solid #17242D', borderRight: '1px solid #17242D', borderLeft: '1px solid #17242D', borderBottom: '4px solid #17242D', backgroundColor: '#fff', width: '100%', borderRadius: '5px'}} 
                onClick={e=> {this.setIsCompanyFormOpen()}}
                >
                    <h2 style={{ margin: '10px 0 10px 0'}}>
                        Configurações da Empresa
                    </h2>
                </button>
                {this.state.isCompanyFormOpen ? (
                    <CompanyForm
                    cancelToken={this.cancelToken}
                    companyData={this.props.billing.companyData}
                    onGetAddressOptions={this.props.onGetAddressOptions}
                    setIsCompanyFormOpen={this.setIsCompanyFormOpen}
                    onChangeCompanyData={this.props.onChangeCompanyData}
                    />
                ): ''}
                <div style={{ borderTop: '20px solid #17242D', borderBottom: '20px solid transparent', borderRight: '20px solid transparent', borderLeft: '20px solid transparent', width: '4px', height: '4px', margin: '0 auto'}}/>
                <button 
                style={{ borderTop: '1px solid #17242D', borderRight: '1px solid #17242D', borderLeft: '1px solid #17242D', borderBottom: '4px solid #17242D', backgroundColor: '#fff', width: '100%', borderRadius: '5px'}}
                onClick={e => this.setIsChargeFormOpen()}
                >
                    <h2 style={{ margin: '10px 0 10px 0'}}>Detalhes da Compra</h2>
                </button>
                {this.state.isChargeFormOpen ? (
                    <ChargeForm
                    onGetTotals={this.props.onGetTotals}
                    chargesData={this.props.billing.chargesData}
                    types={this.props.login.types.billing}
                    />
                ) : ''}
                <div style={{ borderTop: '20px solid #17242D', borderBottom: '20px solid transparent', borderRight: '20px solid transparent', borderLeft: '20px solid transparent', width: '4px', height: '4px', margin: '0 auto'}}/>
                <button 
                style={{ borderTop: '1px solid #17242D', borderRight: '1px solid #17242D', borderLeft: '1px solid #17242D', borderBottom: '4px solid #17242D', backgroundColor: '#fff', width: '100%', borderRadius: '5px'}}
                onClick={e=> this.setIsPaymentFormOpen()}
                >
                    <h2 style={{ margin: '10px 0 10px 0'}}>Configurações de Pagamento</h2>
                </button>
                {this.state.isPaymentFormOpen ? (
                    <PaymentForm
                    onUpdatePaymentData={this.props.onUpdatePaymentData}
                    onRemoveCreditCardData={this.props.onRemoveCreditCardData}
                    onChangePaymentData={this.props.onChangePaymentData}
                    paymentData={this.props.billing.paymentData}
                    types={this.props.login.types.billing}
                    cancelToken={this.cancelToken}
                    onGetAddressOptions={this.props.onGetAddressOptions}
                    setIsEditingPayment={this.setIsEditingPayment}
                    />
                ): ''}
                {/*this.state.isEditingPaymentData ? (
                    <PaymentForm
                    onChangePaymentData={this.props.onChangePaymentData}
                    onChangeCompanyData={this.props.onChangeCompanyData}
                    companyData={this.props.billing.companyData}
                    paymentData={this.props.billing.paymentData}
                    types={this.props.login.types.billing}
                    cancelToken={this.cancelToken}
                    onGetAddressOptions={this.props.onGetAddressOptions}
                    setIsEditingPayment={this.setIsEditingPayment}
                    />
                ): (
                    <button onClick={e=> this.setIsEditingPayment(true)}>Configurar pagamento</button>
                )*/}
            </div>
        )
    }

    render = () => {
        return process.env['APP'] === 'web' ? this.renderWeb() : this.renderMobile()
    }
}

export default connect(state => ({ login: state.login, billing: state.billing }), actions)(Billing)