import React from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { 
    PaymentFormContainer,
    PaymentFormGoBackButton,
    PaymentFormFormularyContainer,
    PaymentFormPaymentHorizontalButtonsContainer,
    PaymentFormPaymentMethodButton,
    PaymentFormTitleLabel,
    PaymentFormPaymentInvoiceDateButton,
    PaymentFormInput
 } from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PaymentForm = (props) => {
    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <PaymentFormContainer>
                <PaymentFormGoBackButton onClick={e => {props.setIsEditingPayment(false)}}>
                    <FontAwesomeIcon icon={'chevron-left'}/>&nbsp;Voltar
                </PaymentFormGoBackButton>
                <PaymentFormFormularyContainer>
                    <PaymentFormPaymentHorizontalButtonsContainer>
                        <PaymentFormPaymentMethodButton isSelected={'true'}>
                            Cartão de Crédito
                        </PaymentFormPaymentMethodButton>
                        <PaymentFormPaymentMethodButton>
                            Boleto
                        </PaymentFormPaymentMethodButton>
                    </PaymentFormPaymentHorizontalButtonsContainer>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <PaymentFormTitleLabel>
                            Data de Cobrança
                        </PaymentFormTitleLabel>
                        <PaymentFormPaymentHorizontalButtonsContainer>
                            <PaymentFormPaymentInvoiceDateButton isSelected={true}>
                                01
                            </PaymentFormPaymentInvoiceDateButton>
                            <PaymentFormPaymentInvoiceDateButton>
                                04
                            </PaymentFormPaymentInvoiceDateButton>
                            <PaymentFormPaymentInvoiceDateButton>
                                15
                            </PaymentFormPaymentInvoiceDateButton>
                            <PaymentFormPaymentInvoiceDateButton>
                                25
                            </PaymentFormPaymentInvoiceDateButton>
                        </PaymentFormPaymentHorizontalButtonsContainer>
                    </div>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <PaymentFormTitleLabel>
                            E-mail de Cobrança
                        </PaymentFormTitleLabel>
                        <PaymentFormInput type={'text'}/>
                    </div>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <PaymentFormTitleLabel>
                            Seus dados
                        </PaymentFormTitleLabel>
                    </div>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <PaymentFormTitleLabel>
                            Dados do Cartão
                        </PaymentFormTitleLabel>
                        <PaymentFormInput type={'number'} placeholder={'Numero do cartão'}/>
                        <div style={{display: 'flex', flexDirection:'row'}}>
                            <PaymentFormInput type={'text'} placeholder={'Validade'}/>
                            <PaymentFormInput type={'number'} placeholder={'CVV'}/>
                        </div>
                        <PaymentFormInput type={'text'} placeholder={'Nome do titular'}/>
                        <PaymentFormInput type={'text'} placeholder={'CPF/CNPJ'}/>
                    </div>
                </PaymentFormFormularyContainer>
            </PaymentFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PaymentForm