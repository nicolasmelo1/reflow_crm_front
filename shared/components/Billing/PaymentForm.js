import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import PaymentAddressForm from './PaymentAddressForm'
import { 
    PaymentFormContainer,
    PaymentFormGoBackButton,
    PaymentFormFormularyContainer,
    PaymentFormPaymentHorizontalButtonsContainer,
    PaymentFormPaymentMethodButton,
    PaymentFormTitleLabel,
    PaymentFormFieldContainer,
    PaymentFormFieldLabel,
    PaymentFormPaymentInvoiceDateButton,
    PaymentFormInput,
 } from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PaymentForm = (props) => {
    const [paymentData, setPaymentData] = useState({
        gateway_token: null,
        cnpj: '',
        company_invoice_emails: [],
        payment_method_type_id: null,
        invoice_date_type_id: null,
        address: '',
        zip_code: '',
        street: '',
        additional_details: '',
        state: '',
        number: '',
        neighborhood: '',
        country: '',
        city: ''
    })

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
                <PaymentFormPaymentHorizontalButtonsContainer>
                    <PaymentFormPaymentMethodButton isSelected={'true'}>
                        Cartão de Crédito
                    </PaymentFormPaymentMethodButton>
                    <PaymentFormPaymentMethodButton>
                        Boleto
                    </PaymentFormPaymentMethodButton>
                </PaymentFormPaymentHorizontalButtonsContainer>
                <PaymentFormFormularyContainer>
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
                            Dados do Cartão
                        </PaymentFormTitleLabel>
                        <PaymentFormFieldContainer>
                            <PaymentFormFieldLabel>
                                Número do Cartão
                            </PaymentFormFieldLabel>
                            <PaymentFormInput type={'number'} placeholder={'Numero do cartão'}/>
                        </PaymentFormFieldContainer>
                        <div style={{display: 'flex', flexDirection:'row'}}>
                            <PaymentFormInput type={'text'} placeholder={'Validade'}/>
                            <PaymentFormInput type={'number'} placeholder={'CVV'}/>
                        </div>
                        <PaymentFormFieldContainer>
                            <PaymentFormFieldLabel>
                                Nome do titular
                            </PaymentFormFieldLabel>
                            <PaymentFormInput type={'text'} placeholder={'Nome do titular'}/>
                        </PaymentFormFieldContainer>
                        <PaymentFormFieldContainer>
                            <PaymentFormFieldLabel>
                                CPF/CNPJ
                            </PaymentFormFieldLabel>
                            <PaymentFormInput type={'text'} placeholder={'CPF/CNPJ'}/>
                        </PaymentFormFieldContainer>
                    </div>
                    <PaymentAddressForm
                    cancelToken={props.cancelToken}
                    onGetAddressOptions={props.onGetAddressOptions}
                    paymentData={paymentData}
                    setPaymentData={setPaymentData}
                    />
                </PaymentFormFormularyContainer>
            </PaymentFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PaymentForm