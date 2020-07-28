import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import axios from 'axios'
import creditCardType from 'credit-card-type'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { VINDI_PUBLIC_API, VINDI_PUBLIC_API_KEY } from '../../config'
import { numberMasker, numberUnmasker } from '../../utils/numberMasker'
import { types, strings } from '../../utils/constants'
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
    BillingInput,
    PaymentFormCreditCardCVVContainer,
    PaymentFormCreditCardValidDateContainer,
    PaymentFormInvoiceMailContainer,
    PaymentFormInvoiceMailDeleteButton,
    PaymentFormInvoiceMailDeleteButtonIcon,
    PaymentFormInvoiceMailAddNewButton
 } from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PaymentForm = (props) => {
    const [creditCardDataErrors, setCreditCardDataErrors] = useState([])
    const [creditCardData, setCreditCardData] = useState({
        card_number: '',
        cvv: '',
        card_expiration: '',
        holder_name: '',
        payment_method_code: 'credit_card',
        payment_company_code: ''
    })

    const removeCreditCardDataErrors = (string) => {
        if (creditCardDataErrors.includes(string)) {
            creditCardDataErrors.splice(creditCardDataErrors.indexOf(string), 1)
            setCreditCardDataErrors([...creditCardDataErrors])
        }
    }

    const onRemoveCompanyInvoiceEmail = (index) => {
        props.paymentData.company_invoice_emails.splice(index, 1)
        props.onChangePaymentData({...props.paymentData})
    }

    const onAddNewCompanyInvoiceEmail = () => {
        props.paymentData.company_invoice_emails.push({email: ''})
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangeCompanyInvoiceEmail = (index, value) => {
        props.paymentData.company_invoice_emails[index] = value
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangePaymentMethodType = (id) => {
        props.paymentData.payment_method_type_id = id
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangeInvoiceDateType = (id) => {
        props.paymentData.invoice_date_type_id = id
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangeHolderName = (data) => {
        removeCreditCardDataErrors('holder_name')
        creditCardData.holder_name = data
        setCreditCardData({...creditCardData})
    }

    const onChangeCreditCardValidDate = (data) => {
        removeCreditCardDataErrors('card_expiration')
        creditCardData.card_expiration = data
        setCreditCardData({...creditCardData})
    }

    const onChangeCreditCardCVV = (data) => {
        removeCreditCardDataErrors('cvv')
        creditCardData.cvv = numberUnmasker(data, "000")
        setCreditCardData({...creditCardData})
    }

    const getCreditCardNumberFormatting = (string) => {
        let length = 0
        const stringWithOnlyNumbers = string.replace(/\D/g,'')
        const stringLength = stringWithOnlyNumbers.length
        const creditCardNumberLengths = creditCardType(stringWithOnlyNumbers)[0]?.lengths || []
        for (let i = 0; i<creditCardNumberLengths.length; i++) {
            if (creditCardNumberLengths[i] >= stringLength) {
                length = creditCardNumberLengths[i]
                break
            }
        }
        return [...Array(length)].map((_, index) => (creditCardType(stringWithOnlyNumbers)[0]?.gaps || []).includes(index) ? " 0" : "0").join('')
    }

    const onChangeCreditCardNumber = (data) => {
        removeCreditCardDataErrors('card_number')
        creditCardData.card_number = numberUnmasker(data, getCreditCardNumberFormatting(data))
        setCreditCardData({...creditCardData})
    }

    const isToShowCreditCardForm = () => {
        if (props.paymentData.credit_card_data){
            return [...Object.entries(props.paymentData.credit_card_data)].some(value => ['', null].includes(value[1]))
        } else {
            return true
        }
    }

    const onSubmitPayment = (gatewayToken=null) => {
        if (gatewayToken) {
            props.paymentData.gateway_token = gatewayToken
        }
        props.onUpdatePaymentData(props.paymentData)
    }

    const onSubmit = () => {
        if (isToShowCreditCardForm()) {
            axios.post(VINDI_PUBLIC_API, {...creditCardData, payment_company_code: creditCardType(creditCardData.card_number)[0].type}, {
                auth: {
                    username: VINDI_PUBLIC_API_KEY,
                    password: ''
                }
            }).then(response => {
                onSubmitPayment(response.data.payment_profile.gateway_token)
            }).catch(error => {
                if (!creditCardDataErrors.includes(error.response.data.errors[0].parameter)) {
                    creditCardDataErrors.push(error.response.data.errors[0].parameter)
                    console.log(error.response.data.errors[0].parameter)
                    setCreditCardDataErrors([...creditCardDataErrors])
                }
            })
        } else {
            onSubmitPayment()
        }
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <PaymentFormContainer>
                <PaymentFormPaymentHorizontalButtonsContainer>
                    {props.types.payment_method_type.map(paymentMethodType => (
                        <PaymentFormPaymentMethodButton 
                        key={paymentMethodType.id}
                        isSelected={paymentMethodType.id === props.paymentData.payment_method_type_id}
                        onClick={e=> onChangePaymentMethodType(paymentMethodType.id)}
                        >
                            {types('pt-br', 'payment_method_type', paymentMethodType.name)}
                        </PaymentFormPaymentMethodButton> 
                    ))}
                </PaymentFormPaymentHorizontalButtonsContainer>
                <div style={{ width: '100%', marginBottom: '10px', backgroundColor: '#fff', borderRadius: '5px', padding: '10px' }}>
                    <PaymentFormTitleLabel>
                        {strings['pt-br']['billingPaymentFormBillingDateTitleLabel']}
                    </PaymentFormTitleLabel>
                    <PaymentFormPaymentHorizontalButtonsContainer>
                        {props.types.invoice_date_type.map(invoiceDateType => (
                            <PaymentFormPaymentInvoiceDateButton 
                            key={invoiceDateType.id}
                            isSelected={invoiceDateType.id === props.paymentData.invoice_date_type_id} 
                            onClick={e=> onChangeInvoiceDateType(invoiceDateType.id)}
                            >
                                {(invoiceDateType.date < 10) ? '0' + invoiceDateType.date.toString() : invoiceDateType.date.toString()}
                            </PaymentFormPaymentInvoiceDateButton>
                        ))}
                    </PaymentFormPaymentHorizontalButtonsContainer>
                </div>
                <div style={{ width: '100%', marginBottom: '10px', backgroundColor: '#fff', borderRadius: '5px', padding: '10px' }}>
                    <PaymentFormTitleLabel>
                        {strings['pt-br']['billingPaymentFormInvoiceEmailsTitleLabel']}
                    </PaymentFormTitleLabel>
                    <PaymentFormInvoiceMailAddNewButton onClick={e=>{onAddNewCompanyInvoiceEmail()}}>
                        {strings['pt-br']['billingPaymentFormAddAnotherEmailButtonLabel']}
                    </PaymentFormInvoiceMailAddNewButton>
                    {props.paymentData.company_invoice_emails.map((companyInvoiceMail, index) => (
                        <PaymentFormInvoiceMailContainer key={index}>
                            <BillingInput 
                            type={'text'} 
                            value={companyInvoiceMail.email} 
                            onChange={e=>onChangeCompanyInvoiceEmail(index, e.target.value)}
                            />
                            {index !== 0 ? (
                                <PaymentFormInvoiceMailDeleteButton 
                                onClick={e=>{onRemoveCompanyInvoiceEmail(index)}}>
                                    <PaymentFormInvoiceMailDeleteButtonIcon icon={'trash'}/>
                                </PaymentFormInvoiceMailDeleteButton>
                            ) : ''}
                        </PaymentFormInvoiceMailContainer>
                    ))}     
                </div>
                {isToShowCreditCardForm() ? (
                    <div style={{ width: '100%',  backgroundColor: '#fff', borderRadius: '5px', padding: '10px' }}>
                        <PaymentFormTitleLabel>
                            {strings['pt-br']['billingPaymentFormPaymentDataTitleLabel']}
                        </PaymentFormTitleLabel>
                        <PaymentFormFieldContainer>
                            <PaymentFormFieldLabel>
                                {strings['pt-br']['billingPaymentFormCreditCardNumberFieldLabel']}
                            </PaymentFormFieldLabel>
                            <BillingInput 
                            type={'text'}
                            errors={creditCardDataErrors.includes('card_number')}
                            onChange={e=> onChangeCreditCardNumber(e.target.value)} 
                            value={numberMasker(
                                creditCardData.card_number, 
                                getCreditCardNumberFormatting(creditCardData.card_number)
                            )}
                            />
                            {creditCardDataErrors.includes('card_number') ? (
                                <small style={{color: 'red'}}>
                                    Valor inválido
                                </small>
                            ) : ''}
                        </PaymentFormFieldContainer>
                        <div style={{display: 'flex', flexDirection:'row', marginBottom: '10px'}}>
                            <PaymentFormCreditCardValidDateContainer>
                                <PaymentFormFieldLabel>
                                    {strings['pt-br']['billingPaymentFormCreditCardNumberFieldLabel']}
                                </PaymentFormFieldLabel>
                                <BillingInput 
                                type={'text'} 
                                placeholder="MM/AA"
                                errors={creditCardDataErrors.includes('card_expiration')}
                                onChange={e=> onChangeCreditCardValidDate(e.target.value)} 
                                value={numberMasker(creditCardData.card_expiration, "00/00")}
                                />
                                {creditCardDataErrors.includes('card_expiration') ? (
                                    <small style={{color: 'red'}}>
                                        Valor inválido
                                    </small>
                                ) : ''}
                            </PaymentFormCreditCardValidDateContainer>
                            <PaymentFormCreditCardCVVContainer>
                                <PaymentFormFieldLabel>
                                    {strings['pt-br']['billingPaymentFormCreditCardCVVFieldLabel']}
                                </PaymentFormFieldLabel>
                                <BillingInput 
                                type={'text'} 
                                errors={creditCardDataErrors.includes('cvv')}
                                onChange={e=> onChangeCreditCardCVV(e.target.value)} 
                                value={numberMasker(creditCardData.cvv, [...Array(creditCardType(creditCardData.card_number)[0].code.size)].map(_ => "0").join(''))}
                                />
                                {creditCardDataErrors.includes('cvv') ? (
                                    <small style={{color: 'red'}}>
                                        Valor inválido
                                    </small>
                                ) : ''}
                            </PaymentFormCreditCardCVVContainer>
                        </div>
                        <PaymentFormFieldContainer>
                            <PaymentFormFieldLabel>
                                {strings['pt-br']['billingPaymentFormCreditCardHolderNameFieldLabel']}
                            </PaymentFormFieldLabel>
                            <BillingInput 
                            type={'text'} 
                            errors={creditCardDataErrors.includes('holder_name')}
                            onChange={e=>onChangeHolderName(e.target.value)} 
                            value={creditCardData.holder_name}/>
                            {creditCardDataErrors.includes('holder_name') ? (
                                <small style={{color: 'red'}}>
                                    Valor inválido
                                </small>
                            ) : ''}
                        </PaymentFormFieldContainer>
                    </div>
                ) : (
                    <div style={{ width: '100%',  backgroundColor: '#fff', borderRadius: '5px', padding: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '100%',  backgroundColor: '#fff', borderRadius: '5px', padding: '10px', border: '1px solid #17242D', display: 'flex', flexDirection: 'row', justifyContent:'space-between' }}>
                            {props.paymentData.credit_card_data.payment_company_name + '● ● ● ●  ' + props.paymentData.credit_card_data.card_number_last_four} 
                            <img style={{ maxHeight: '25px' }} src={`/credit_card_logos/${props.paymentData.credit_card_data.credit_card_code}.png`}></img>
                        </div>
                        <button style={{ border: 0, backgroundColor: 'transparent', padding: '10px', marginLeft: '10px' }} onClick={e=>{props.onRemoveCreditCardData()}}>
                            <FontAwesomeIcon style={{ color: 'red' }} icon={'trash'}/>
                        </button>
                    </div>
                )}
                <button 
                onClick={e => {onSubmit()}}
                style={{ border: 0, backgroundColor: '#0dbf7e', borderRadius: '20px', width: '100%', padding: '10px', marginTop: '10px' }}
                >
                    Salvar
                </button>
            </PaymentFormContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PaymentForm