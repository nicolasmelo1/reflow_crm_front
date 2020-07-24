import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Select } from '../Utils'
import { numberMasker, numberUnmasker } from '../../utils/numberMasker'
import { strings } from '../../utils/constants'
import { 
    PaymentFormTitleLabel,
    PaymentFormInput,
    PaymentFormFieldSelectContainer,
    PaymentFormFieldLabel,
    PaymentFormFieldContainer
 } from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PaymentAddressForm = (props) => {
    const sourceRef = React.useRef(null)
    const [addressOptions, setAddressOptions] = useState([])

    const onChangeStreet = (data) => {
        props.paymentData.street = data
        props.setPaymentData({...props.paymentData})
    }

    const onChangeNeighborhood = (data) => {
        props.paymentData.neighborhood = data
        props.setPaymentData({...props.paymentData})
    }

    const onChangeNumber = (data) => {
        props.paymentData.number = data
        props.setPaymentData({...props.paymentData})
    }

    const onChangeAdditionalDetails = (data) => {
        props.paymentData.additional_details = data
        props.setPaymentData({...props.paymentData})
    }

    const onChangeZipCode = (data) => {
        props.paymentData.zip_code = numberUnmasker(data, '00000-000')
        props.setPaymentData({...props.paymentData})
    }

    const onChangeState = (data) => {
        props.paymentData.state = data[0]
        props.setPaymentData({...props.paymentData})
    }

    const onChangeCity = (data) => {
        props.paymentData.city = data[0]
        props.setPaymentData({...props.paymentData})
    }

    const stateOptions = addressOptions.filter((addressOption, index, array) => array.findIndex(temp => temp.state === addressOption.state) === index)
                         .map(addressOption => ({ value: addressOption.state_code, label: addressOption.state }))
    const cityOptions = (!['', null].includes(props.paymentData.state)) ? addressOptions.filter(addressOption=> addressOption.state_code === props.paymentData.state)
                        .map(addressOption => ({ value: addressOption.city, label: addressOption.city })) : []

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()

        props.onGetAddressOptions(sourceRef.current).then(response => {
            if (response && response.status === 200) {
                setAddressOptions(response.data.data)
            }
        })

        return () => {
            if (sourceRef.current) {
                sourceRef.current.cancel()
            }
        }
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }
    
    const renderWeb = () => {
        return (
            <div style={{ width: '100%', marginBottom: '50px' }}>
                <PaymentFormTitleLabel>
                    {strings['pt-br']['billingPaymentFormInvoiceAddressTitleLabel']}
                </PaymentFormTitleLabel>
                <PaymentFormFieldContainer>
                    <PaymentFormFieldLabel>
                        {strings['pt-br']['billingPaymentFormAddressStreetFieldLabel']}
                    </PaymentFormFieldLabel>
                    <PaymentFormInput type={'text'} value={props.paymentData.street} onChange={e=> onChangeStreet(e.target.value)}/>
                </PaymentFormFieldContainer>
                <PaymentFormFieldContainer>
                    <PaymentFormFieldLabel>
                        {strings['pt-br']['billingPaymentFormAddressNeighborhoodFieldLabel']}
                    </PaymentFormFieldLabel>
                    <PaymentFormInput type={'text'} value={props.paymentData.neighborhood} onChange={e=> onChangeNeighborhood(e.target.value)}/>
                </PaymentFormFieldContainer>
                <PaymentFormFieldContainer>
                    <PaymentFormFieldLabel>
                        {strings['pt-br']['billingPaymentFormAddressNumberFieldLabel']}
                    </PaymentFormFieldLabel>
                    <PaymentFormInput type={'number'} placeholder={'Número'} value={props.paymentData.number} onChange={e=> onChangeNumber(e.target.value)}/>
                </PaymentFormFieldContainer>
                <PaymentFormFieldContainer>
                    <PaymentFormFieldLabel>
                        {strings['pt-br']['billingPaymentFormAddressAdditionalInformationFieldLabel']}
                    </PaymentFormFieldLabel>
                    <PaymentFormInput type={'text'} placeholder={'Complemento'} value={props.paymentData.additional_details} onChange={e=> onChangeAdditionalDetails(e.target.value)}/>
                </PaymentFormFieldContainer>
                <PaymentFormFieldContainer>
                    <PaymentFormFieldLabel>
                        {strings['pt-br']['billingPaymentFormAddressZipCodeFieldLabel']}
                    </PaymentFormFieldLabel>
                    <PaymentFormInput type={'text'} placeholder={'CEP'} value={numberMasker(props.paymentData.zip_code, '00000-000')} onChange={e=> onChangeZipCode(e.target.value)}/>
                </PaymentFormFieldContainer>
                <PaymentFormFieldContainer>
                    <PaymentFormFieldLabel>
                        {strings['pt-br']['billingPaymentFormAddressStateFieldLabel']}
                    </PaymentFormFieldLabel>
                    <PaymentFormFieldSelectContainer>
                        <Select
                        fixedHeight={true}
                        options={stateOptions}
                        initialValues={stateOptions.filter(stateOption => stateOption.value === props.paymentData.state)}
                        onChange={onChangeState}
                        />
                    </PaymentFormFieldSelectContainer>
                </PaymentFormFieldContainer>
                <PaymentFormFieldContainer>
                    <PaymentFormFieldLabel>
                        {strings['pt-br']['billingPaymentFormAddressCityFieldLabel']}
                    </PaymentFormFieldLabel>
                    <PaymentFormFieldSelectContainer>
                        <Select
                        fixedHeight={true}
                        options={cityOptions}
                        initialValues={cityOptions.filter(cityOption => cityOption.value === props.paymentData.city)}
                        onChange={onChangeCity}
                        />
                    </PaymentFormFieldSelectContainer>
                </PaymentFormFieldContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PaymentAddressForm