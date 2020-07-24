import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import PaymentAddressForm from './PaymentAddressForm'
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
    PaymentFormInput,
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
    const [creditCardData, setCreditCardData] = useState({
        number: '',
        cvv: '',
        valid_date: '',
        holder_name: ''
    })
    const [paymentData, setPaymentData] = useState({
        gateway_token: null,
        cnpj: '',
        company_invoice_emails: [{email: ''}],
        payment_method_type_id: props.types.payment_method_type.filter(paymentMethodType => paymentMethodType.name === 'credit_card').length > 0 ? 
                                props.types.payment_method_type.filter(paymentMethodType => paymentMethodType.name === 'credit_card')[0].id : null,
        invoice_date_type_id: props.types.invoice_date_type.filter(invoiceDateType => invoiceDateType.date === 1).length > 0 ? 
                              props.types.invoice_date_type.filter(invoiceDateType => invoiceDateType.date === 1)[0].id : null,
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

    const onRemoveCompanyInvoiceEmail = (index) => {
        props.paymentData.company_invoice_emails.splice(index, 1)
        props.onChangePaymentData({...props.paymentData})
    }

    const onAddNewCompanyInvoiceEmail = () => {
        props.paymentData.company_invoice_emails.push({email: ''})
        props.onChangePaymentData({...props.props.paymentData})
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

    const onChangeCNPJ = (data) => {
        props.paymentData.cnpj = data
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangeHolderName = (data) => {
        creditCardData.holder_name = data
        setCreditCardData({...creditCardData})
    }

    const onChangeCreditCardValidDate = (data) => {
        creditCardData.valid_date = numberUnmasker(data, "00/00")
        setCreditCardData({...creditCardData})
    }

    const onChangeCreditCardCVV = (data) => {
        creditCardData.cvv = numberUnmasker(data, "000")
        setCreditCardData({...creditCardData})
    }

    const onChangeCreditCardNumber = (data) => {
        creditCardData.number = numberUnmasker(data, "0000 0000 0000 0000")
        setCreditCardData({...creditCardData})
    }


    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <PaymentFormContainer>
                <PaymentFormGoBackButton onClick={e => {props.setIsEditingPayment(false)}}>
        <FontAwesomeIcon icon={'chevron-left'}/>&nbsp;{strings['pt-br']['billingGoBackButtonLabel']}
                </PaymentFormGoBackButton>
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
                <PaymentFormFormularyContainer>
                    <div style={{ width: '100%', marginBottom: '10px' }}>
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
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <PaymentFormTitleLabel>
                            {strings['pt-br']['billingPaymentFormInvoiceEmailsTitleLabel']}
                        </PaymentFormTitleLabel>
                        <PaymentFormInvoiceMailAddNewButton onClick={e=>{onAddNewCompanyInvoiceEmail()}}>
                            {strings['pt-br']['billingPaymentFormAddAnotherEmailButtonLabel']}
                        </PaymentFormInvoiceMailAddNewButton>
                        {props.paymentData.company_invoice_emails.map((companyInvoiceMail, index) => (
                            <PaymentFormInvoiceMailContainer key={index}>
                                <PaymentFormInput 
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
                    <div style={{ width: '100%', marginBottom: '10px' }}>
                        <PaymentFormTitleLabel>
                            {strings['pt-br']['billingPaymentFormPaymentDataTitleLabel']}
                        </PaymentFormTitleLabel>
                        <PaymentFormFieldContainer>
                            <PaymentFormFieldLabel>
                                {strings['pt-br']['billingPaymentFormCreditCardNumberFieldLabel']}
                            </PaymentFormFieldLabel>
                            <PaymentFormInput 
                            type={'text'}
                            onChange={e=> onChangeCreditCardNumber(e.target.value)} 
                            value={numberMasker(creditCardData.number, "0000 0000 0000 0000")}
                            />
                        </PaymentFormFieldContainer>
                        <div style={{display: 'flex', flexDirection:'row', marginBottom: '10px'}}>
                            <PaymentFormCreditCardValidDateContainer>
                                <PaymentFormFieldLabel>
                                    {strings['pt-br']['billingPaymentFormCreditCardNumberFieldLabel']}
                                </PaymentFormFieldLabel>
                                <PaymentFormInput 
                                type={'text'} 
                                placeholder="MM/AA"
                                onChange={e=> onChangeCreditCardValidDate(e.target.value)} 
                                value={numberMasker(creditCardData.valid_date, "00/00")}
                                />
                            </PaymentFormCreditCardValidDateContainer>
                            <PaymentFormCreditCardCVVContainer>
                                <PaymentFormFieldLabel>
                                    {strings['pt-br']['billingPaymentFormCreditCardCVVFieldLabel']}
                                </PaymentFormFieldLabel>
                                <PaymentFormInput 
                                type={'text'} 
                                onChange={e=> onChangeCreditCardCVV(e.target.value)} 
                                value={numberMasker(creditCardData.cvv, "000")}
                                />
                            </PaymentFormCreditCardCVVContainer>
                        </div>
                        <PaymentFormFieldContainer>
                            <PaymentFormFieldLabel>
                                {strings['pt-br']['billingPaymentFormCreditCardHolderNameFieldLabel']}
                            </PaymentFormFieldLabel>
                            <PaymentFormInput type={'text'} onChange={e=>onChangeHolderName(e.target.value)} value={creditCardData.holder_name}/>
                        </PaymentFormFieldContainer>
                        <PaymentFormFieldContainer>
                            <PaymentFormFieldLabel>
                                {strings['pt-br']['billingPaymentFormCNPJFieldLabel']}
                            </PaymentFormFieldLabel>
                            <PaymentFormInput type={'text'} onChange={e=>onChangeCNPJ(e.target.value)} value={props.paymentData.cnpj}/>
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