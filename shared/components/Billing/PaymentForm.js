import React from 'react'
import { View } from 'react-native'
import creditCardType from 'credit-card-type'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { numberMasker, numberUnmasker } from '../../utils/numberMasker'
import { types, strings } from '../../utils/constants'
import { 
    BillingFormularyRequiredField,
    BillingFormularyContainer,
    BillingFormularyFieldLabel,
    BillingFormularySectionContainer,
    BillingFormularyFieldContainer,
    BillingFormularySectionTitleLabel,
    BillingFormularyErrorMessage,
    BillingInput,
    PaymentFormPaymentHorizontalButtonsContainer,
    PaymentFormPaymentMethodButton,
    PaymentFormPaymentInvoiceDateButton,
    PaymentFormCreditCardCVVContainer,
    PaymentFormCreditCardValidDateContainer,
    PaymentFormInvoiceMailContainer,
    PaymentFormInvoiceMailDeleteButton,
    PaymentFormInvoiceMailDeleteButtonIcon,
    PaymentFormInvoiceMailAddNewButton,
    PaymentFormCreditCardInfoCardContainer,
    PaymentFormCreditCardInfoContainer,
    PaymentFormCreditCardInfoDeleteButtonIcon,
    PaymentFormCreditCardInfoDeleteButton,
    PaymentFormCreditCardInfoCreditCardFlagLogo
 } from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PaymentForm = (props) => {
    const getPaymentMethodTypeName = () => {
        const paymentMethodType = props.types.payment_method_type.filter(paymentMethodType => paymentMethodType.id === props.paymentData.payment_method_type_id)
        if (paymentMethodType.length > 0) {
            return paymentMethodType[0].name
        } else {
            return 'credit_card'
        }
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

    const isToShowErrorOnEmailField = (email) => {
        const hasCompanyInvoiceEmailsInErrorObj = Array.from(Object.keys(props.paymentDataFormErrors)).includes('company_invoice_emails')
        if (hasCompanyInvoiceEmailsInErrorObj) {
            const errorMessagesArray = props.paymentDataFormErrors.company_invoice_emails.map(companyInvoiceMail => (companyInvoiceMail?.email) ? companyInvoiceMail.email[0]: '')
            console.log(errorMessagesArray)
            if (props.paymentDataFormErrors.company_invoice_emails.includes('invalid')) {
                return true
            } else if (errorMessagesArray.includes('blank') && email===''){
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const removeCreditCardDataErrors = (string) => {
        if (props.creditCardDataErrors.includes(string)) {
            props.creditCardDataErrors.splice(props.creditCardDataErrors.indexOf(string), 1)
            props.setCreditCardDataErrors([...props.creditCardDataErrors])
        }
    }

    const onRemoveCompanyInvoiceEmail = (index) => {
        delete props.paymentDataFormErrors.company_invoice_emails
        props.paymentData.company_invoice_emails.splice(index, 1)
        props.setPaymentDataFormErrors({...props.paymentDataFormErrors})
        props.onChangePaymentData({...props.paymentData})
    }

    const onAddNewCompanyInvoiceEmail = () => {
        delete props.paymentDataFormErrors.company_invoice_emails
        props.paymentData.company_invoice_emails.push({email: ''})
        props.setPaymentDataFormErrors({...props.paymentDataFormErrors})
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangeCompanyInvoiceEmail = (index, value) => {
        delete props.paymentDataFormErrors.company_invoice_emails
        props.paymentData.company_invoice_emails[index] = {email: value}
        props.setPaymentDataFormErrors({...props.paymentDataFormErrors})
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangePaymentMethodType = (id) => {
        props.paymentData.payment_method_type_id = id
        props.setCreditCardDataErrors([])
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangeInvoiceDateType = (id) => {
        props.paymentData.invoice_date_type_id = id
        props.onChangePaymentData({...props.paymentData})
    }

    const onChangeHolderName = (data) => {
        removeCreditCardDataErrors('holder_name')
        props.creditCardData.holder_name = data
        props.setCreditCardData({...props.creditCardData})
    }

    const onChangeCreditCardValidDate = (data) => {
        removeCreditCardDataErrors('card_expiration')
        props.creditCardData.card_expiration = data
        props.setCreditCardData({...props.creditCardData})
    }

    const onChangeCreditCardCVV = (data) => {
        removeCreditCardDataErrors('cvv')
        props.creditCardData.cvv = numberUnmasker(data, "000")
        props.setCreditCardData({...props.creditCardData})
    }

    const onChangeCreditCardNumber = (data) => {
        removeCreditCardDataErrors('card_number')
        props.creditCardData.card_number = numberUnmasker(data, getCreditCardNumberFormatting(data))
        props.setCreditCardData({...props.creditCardData})
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <BillingFormularyContainer>
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
                <BillingFormularySectionContainer>
                    <BillingFormularySectionTitleLabel>
                        {strings['pt-br']['billingPaymentFormBillingDateTitleLabel']}
                    </BillingFormularySectionTitleLabel>
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
                </BillingFormularySectionContainer>
                <BillingFormularySectionContainer>
                    <BillingFormularySectionTitleLabel>
                        {strings['pt-br']['billingPaymentFormInvoiceEmailsTitleLabel']}
                    </BillingFormularySectionTitleLabel>
                    <PaymentFormInvoiceMailAddNewButton onClick={e=>{onAddNewCompanyInvoiceEmail()}}>
                        {strings['pt-br']['billingPaymentFormAddAnotherEmailButtonLabel']}
                    </PaymentFormInvoiceMailAddNewButton>
                    {props.paymentData.company_invoice_emails.map((companyInvoiceMail, index) => (
                        <PaymentFormInvoiceMailContainer key={index}>
                            <BillingInput 
                            type={'text'} 
                            errors={isToShowErrorOnEmailField(companyInvoiceMail.email)}
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
                    {props.paymentDataFormErrors.company_invoice_emails && props.paymentDataFormErrors.company_invoice_emails.includes('invalid') ? (
                        <BillingFormularyErrorMessage>
                            {strings['pt-br']['billingPaymentFormMaximumInvoiceEmailNumberErrorMessageLabel']}
                        </BillingFormularyErrorMessage>
                    ) : ''}
                </BillingFormularySectionContainer>
                {props.isToShowCreditCardForm() ? (
                    <BillingFormularySectionContainer>
                        <BillingFormularySectionTitleLabel>
                            {strings['pt-br']['billingPaymentFormPaymentDataTitleLabel']}
                        </BillingFormularySectionTitleLabel>
                        <BillingFormularyFieldContainer>
                            <BillingFormularyFieldLabel>
                                {strings['pt-br']['billingPaymentFormCreditCardNumberFieldLabel']}
                                <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                            </BillingFormularyFieldLabel>
                            <BillingInput 
                            type={'text'}
                            errors={props.creditCardDataErrors.includes('card_number')}
                            onChange={e=> onChangeCreditCardNumber(e.target.value)} 
                            value={numberMasker(
                                props.creditCardData.card_number, 
                                getCreditCardNumberFormatting(props.creditCardData.card_number)
                            )}
                            />
                            {props.creditCardDataErrors.includes('card_number') ? (
                                <BillingFormularyErrorMessage>
                                    {strings['pt-br']['billingPaymentFormCreditCardErrorMessageLabel']}
                                </BillingFormularyErrorMessage>
                            ) : ''}
                        </BillingFormularyFieldContainer>
                        <div style={{display: 'flex', flexDirection:'row', marginBottom: '10px', alignItems: 'flex-end'}}>
                            <PaymentFormCreditCardValidDateContainer>
                                <BillingFormularyFieldLabel>
                                    {strings['pt-br']['billingPaymentFormCreditCardNumberFieldLabel']}
                                    <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                                </BillingFormularyFieldLabel>
                                <BillingInput 
                                type={'text'} 
                                placeholder="MM/AA"
                                errors={props.creditCardDataErrors.includes('card_expiration')}
                                onChange={e=> onChangeCreditCardValidDate(e.target.value)} 
                                value={numberMasker(props.creditCardData.card_expiration, "00/00")}
                                />
                                {props.creditCardDataErrors.includes('card_expiration') ? (
                                    <BillingFormularyErrorMessage>
                                        {strings['pt-br']['billingPaymentFormCreditCardErrorMessageLabel']}
                                    </BillingFormularyErrorMessage>
                                ) : ''}
                            </PaymentFormCreditCardValidDateContainer>
                            <PaymentFormCreditCardCVVContainer>
                                <BillingFormularyFieldLabel>
                                    {strings['pt-br']['billingPaymentFormCreditCardCVVFieldLabel']}
                                    <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                                </BillingFormularyFieldLabel>
                                <BillingInput 
                                type={'text'} 
                                errors={props.creditCardDataErrors.includes('cvv')}
                                onChange={e=> onChangeCreditCardCVV(e.target.value)} 
                                value={numberMasker(props.creditCardData.cvv, [...Array(creditCardType(props.creditCardData.card_number)[0].code.size)].map(_ => "0").join(''))}
                                />
                                {props.creditCardDataErrors.includes('cvv') ? (
                                    <BillingFormularyErrorMessage>
                                        {strings['pt-br']['billingPaymentFormCreditCardErrorMessageLabel']}
                                    </BillingFormularyErrorMessage>
                                ) : ''}
                            </PaymentFormCreditCardCVVContainer>
                        </div>
                        <BillingFormularyFieldContainer>
                            <BillingFormularyFieldLabel>
                                {strings['pt-br']['billingPaymentFormCreditCardHolderNameFieldLabel']}
                                <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                            </BillingFormularyFieldLabel>
                            <BillingInput 
                            type={'text'} 
                            errors={props.creditCardDataErrors.includes('holder_name')}
                            onChange={e=>onChangeHolderName(e.target.value)} 
                            value={props.creditCardData.holder_name}/>
                            {props.creditCardDataErrors.includes('holder_name') ? (
                                <BillingFormularyErrorMessage>
                                    {strings['pt-br']['billingPaymentFormCreditCardErrorMessageLabel']}
                                </BillingFormularyErrorMessage>
                            ) : ''}
                        </BillingFormularyFieldContainer>
                    </BillingFormularySectionContainer>
                ) : (
                    <div>
                        {getPaymentMethodTypeName() === 'credit_card' ? (
                            <PaymentFormCreditCardInfoCardContainer>
                                <PaymentFormCreditCardInfoContainer>
                                    {props.paymentData.credit_card_data.payment_company_name + '● ● ● ●  ' + props.paymentData.credit_card_data.card_number_last_four} 
                                    <PaymentFormCreditCardInfoCreditCardFlagLogo src={`/credit_card_logos/${props.paymentData.credit_card_data.credit_card_code}.png`}/>
                                </PaymentFormCreditCardInfoContainer>
                                <PaymentFormCreditCardInfoDeleteButton onClick={e=>{props.onRemoveCreditCardData()}}>
                                    <PaymentFormCreditCardInfoDeleteButtonIcon icon={'trash'}/>
                                </PaymentFormCreditCardInfoDeleteButton>
                            </PaymentFormCreditCardInfoCardContainer>
                        ) : (
                            <BillingFormularySectionContainer>
                                <p style={{ margin: '0' }}>
                                    {strings['pt-br']['billingPaymentFormInvoiceMessage']}
                                </p>
                            </BillingFormularySectionContainer>
                        )}
                    </div>
                )}
            </BillingFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PaymentForm