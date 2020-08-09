import React from 'react'
import { View } from 'react-native'
import creditCardType from 'credit-card-type'
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
 * This component holds the payment data of the billing formulary. Payment data can be separated in 4 distinct section
 * with one of them being optional:
 * 
 * 1 - The payment method type - Can be credit card or boleto right now.
 * 2 - The invoice date - This is the date of the month when we will bill the user. The user can select if he wants to be billed in the end of the month,
 * in the middle of the month, or in the start of the month.
 * 3 - The company invoice emails - This emails are usually the emails that we will send the invoice data, or the boleto. The user can add
 * a maximum of 3 emails that we can notify.
 * 4 - The credit card formulary - (optional) - This is required only if the payment method type selected is credit_card if it is boleto we don't even show the 
 * credit card formulary to the user. Instead we show just a simple generic information.
 * 
 * @param {Object} types - The types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff. On this case we send just the billing types here.
 * @param {Function} setPaymentDataFormErrors - This is a function for the Billing component. This is to change the state of the 
 * `paymentDataFormErrors` object in the billing component. We use this for everytime we write in a field (that is not responsible for credit card information) 
 * of the in this component formulary, with this we can dismiss the error alert on the field after the user types.
 * @param {Object} paymentDataFormErrors - This object holds all the errors data where each field_name (where field name is each key of the object we send in the
 * PUT request to the server and that is not responsible for credit card information) so we can display the errors of the paymentData state for the user.
 * @param {Function} setCreditCardData - Responsible for changing the creditCardData state on the parent component. This state holds all of the credit card
 * information needed so we can send it to VINDI in order to create a new gatewayToken before saving. Credit card data is only needed if the payment method type
 * is of type `credit_card`.
 * @param {Object} creditCardData - The credit card data that we use on the credit card form. This data is separated from the paymentData because the paymentData
 * is the data that we send to the server. The `creditCardData` object is the data that we send to VINDI to create a new gatewayToken.
 * @param {Array<Object>} creditCardDataErrors - The errors of the credit card formulary, we get these errors when we send a request to VINDI. These errors
 * are different from the others since this is entirely handled by VINDI itself and it sends an array to us that is difficult to parse.
 * @param {Function} setCreditCardDataErrors - Used for dismissing the errors to the user when he fills a field that contains errors on the creditCardData.
 * @param {Function} isToShowCreditCardForm - This is a function that returns true or false if it needs to show the credit card formulary or not.
 * @param {Function} onRemoveCreditCardData - This is a redux action that we use to remove a credit card from the VINDI payment gateway. We don't save the credit
 * card data in our database, but instead in the payment gateway.
 * @param {Function} onChangePaymentData - This is a redux action function that changes the payment data in the redux reducer.
 * @param {Object} paymentData - this payment data holds the `payment method type`, the `invoice date` and the `company invoice emails`. 
 * As we said earlier the credit card data is left out of separated from this data, because the creditCardData is sent directly to VINDI, this goes to our backend.
 */
const PaymentForm = (props) => {
    /**
     * Gets the paymentMethodType name based on the current selected paymentData.payment_method_type_id.
     * 
     * Since the paymentData.payment_method_type_id holds the id, sometimes we need the name of this paymentMethodType so it's easier to work and make conditions,
     * ids can always change. Because of this we use this function so it returns an string with the current selected paymentMethodType name.
     */
    const getPaymentMethodTypeName = () => {
        const paymentMethodType = props.types.payment_method_type.filter(paymentMethodType => paymentMethodType.id === props.paymentData.payment_method_type_id)
        if (paymentMethodType.length > 0) {
            return paymentMethodType[0].name
        } else {
            return 'credit_card'
        }
    }

    /**
     * Because credit card numbers changes too often we use the creditCardType package to get the mask of the typed credit card.
     * 
     * So this way we can format and mask the input while the user is typing, preventing him from adding extra numbers and improving
     * the hole experience while writing the credit card number.
     * 
     * This function here is responsible to get the credit card number formating for the mask.
     * 
     * Reference: https://github.com/braintree/credit-card-type
     * 
     * @param {String} string - This is a text that could be formatted with spaces, or dots. This string represents 
     * the credit card number.
     */
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

    /**
     * This is actually an helper function that have a simple usage. This function is used to handle if the particular `invoice company email`
     * needs to have an error rendered or not. 
     * 
     * It is simple actully, if we have 3 `invoice company email` we will have an array like:
     * [{email: 'firstemail@email.com'}, {email: 'secondemail@email.com'},  {email: ''}]
     * 
     * This array will render 3 inputs, and obviously when you submit this formulary the backend will throw an error because it can't accept an empty email
     * Because of this we use this function so we know we need to render the error for the input in the index 2. 
     * 
     * @param {String} email - The email string from the object it's the `email` attribute of the object.
     */
    const isToShowErrorOnEmailField = (email) => {
        const hasCompanyInvoiceEmailsInErrorObj = Array.from(Object.keys(props.paymentDataFormErrors)).includes('company_invoice_emails')
        if (hasCompanyInvoiceEmailsInErrorObj) {
            const errorMessagesArray = props.paymentDataFormErrors.company_invoice_emails.map(companyInvoiceMail => (companyInvoiceMail?.email) ? companyInvoiceMail.email[0]: '')
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

    /**
     * Handy function to remove the error from the `creditCardDataErrors` from the Billing component. Since this is entirely
     * handled by vindi, we work with the errors that they send to us and just appends to a list instead of an object as the others.
     * 
     * @param {(card_number'|'cvv'|card_expiration'|'holder_name'|'payment_company_code')} string - 
     * This string is the creditCardData key to remove. Check the object in the Billing component and you will see
     * the options. Right now they are: `card_number`, `cvv`, `card_expiration`, `holder_name`, `payment_company_code`
     */
    const removeCreditCardDataErrors = (string) => {
        if (props.creditCardDataErrors.includes(string)) {
            props.creditCardDataErrors.splice(props.creditCardDataErrors.indexOf(string), 1)
            props.setCreditCardDataErrors([...props.creditCardDataErrors])
        }
    }

    /**
     * Removes an invoiceEmail object from the array of invoice emails.
     * 
     * Using the following example: 
     * [{email: 'firstemail@email.com'}, {email: 'secondemail@email.com'},  {email: ''}]
     * 
     * If we send the index 1 we will remove the following object: 
     * {email: 'secondemail@email.com'}
     * 
     * That's what this function do.
     * 
     * @param {BigInteger} index - The index of the email you want to remove from the array.
     */
    const onRemoveCompanyInvoiceEmail = (index) => {
        delete props.paymentDataFormErrors.company_invoice_emails
        props.paymentData.company_invoice_emails.splice(index, 1)
        props.setPaymentDataFormErrors({...props.paymentDataFormErrors})
        props.onChangePaymentData({...props.paymentData})
    }
    
    /**
     * This function appends a new email object to the end of the list.
     * 
     * Using the following example: 
     * [{email: 'firstemail@email.com'}, {email: 'secondemail@email.com'},  {email: ''}]
     * 
     * If we want to insert a new email the array will become: 
     * [{email: 'firstemail@email.com'}, {email: 'secondemail@email.com'},  {email: ''}, {email: ''}]
     */
    const onAddNewCompanyInvoiceEmail = () => {
        delete props.paymentDataFormErrors.company_invoice_emails
        props.paymentData.company_invoice_emails.push({email: ''})
        props.setPaymentDataFormErrors({...props.paymentDataFormErrors})
        props.onChangePaymentData({...props.paymentData})
    }

    /**
     * Changes the companyInvoiceEmail email string based on a specific index.
     * 
     * Using the following example: 
     * [{email: 'firstemail@email.com'}, {email: 'secondemail@email.com'},  {email: ''}]
     * 
     * If we want to change the email from the last object to 'reflow@reflow.com.br' you will send
     * the index param as 2 and the value param as 'reflow@reflow.com.br'
     * 
     * @param {BigInteger} index - The index of the object in the array that you want to change.
     * @param {String} value - The new value of the email in the object at the index you specified in the array.
     */
    const onChangeCompanyInvoiceEmail = (index, value) => {
        delete props.paymentDataFormErrors.company_invoice_emails
        props.paymentData.company_invoice_emails[index] = {email: value}
        props.setPaymentDataFormErrors({...props.paymentDataFormErrors})
        props.onChangePaymentData({...props.paymentData})
    }

    /**
     * This changes the payment_method_type_id on the paymentData object. We use the Id here and not the string.
     * 
     * @param {BigInteger} id - The new payment_method_type id
     */
    const onChangePaymentMethodType = (id) => {
        props.paymentData.payment_method_type_id = id
        props.setCreditCardDataErrors([])
        props.onChangePaymentData({...props.paymentData})
    }

    /**
     * This changes the invoice_date_type_id on the paymentData object. We use the Id here and not the date directly.
     * We need to set the id because we limit the dates on the backend so the user can't set random dates and stay locked
     * on the ones that we already choose for him
     * 
     * @param {BigInteger} id - The new invoice_date_type id
     */
    const onChangeInvoiceDateType = (id) => {
        props.paymentData.invoice_date_type_id = id
        props.onChangePaymentData({...props.paymentData})
    }

    /**
     * Only used on the credit card formulary. Changes the holder name of the creditCardData. This is required for VINDI.
     * 
     * @param {String} data - The new value of the holder name in the creditCardData
     */
    const onChangeHolderName = (data) => {
        removeCreditCardDataErrors('holder_name')
        props.creditCardData.holder_name = data
        props.setCreditCardData({...props.creditCardData})
    }

    /**
     * Only used on the credit card formulary. Changes the valid date of the creditCardData. This is required for VINDI.
     * This is masked in the input, but we don't unmask here because we actually need to send in the format stipulated by VINDI
     * 
     * @param {String} data - The new value of the valid date in the creditCardData
     */
    const onChangeCreditCardValidDate = (data) => {
        removeCreditCardDataErrors('card_expiration')
        props.creditCardData.card_expiration = data
        props.setCreditCardData({...props.creditCardData})
    }

    /**
     * Only used on the credit card formulary. Changes the cvv of the creditCardData. This is required for VINDI.
     * This is usually the 3 number digit in the back of the card. Most cards don't change the 3 number format, but it will
     * be actually better if we used the credit-card-type package.
     * 
     * @param {String} data - The new value of the cvv in the creditCardData, usually only numbers
     */
    const onChangeCreditCardCVV = (data) => {
        removeCreditCardDataErrors('cvv')
        props.creditCardData.cvv = numberUnmasker(data, "000")
        props.setCreditCardData({...props.creditCardData})
    }
    /**
     * Only used on the credit card formulary. Changes the credit card number of the creditCardData. This is required for VINDI.
     * The format of the mask actually changes as the user types, see `getCreditCardNumberFormatting` function for details.
     * 
     * @param {String} data - The new value of the credit card number in the creditCardData masked, usually only numbers, but since it is masked
     * it can accept stuff like spaces, dots, and so on.
     */
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
                            {strings['pt-br']['billingPaymentFormMaximumOrNoneInvoiceEmailNumberErrorMessageLabel']}
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