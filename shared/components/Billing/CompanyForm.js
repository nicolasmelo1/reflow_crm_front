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

    const onChangeCompanyName = (data) => {
        props.companyData.name = data
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeCompanyDocumentNumber = (data) => {
        props.companyData.cnpj = data
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeStreet = (data) => {
        props.companyData.street = data
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeNeighborhood = (data) => {
        props.companyData.neighborhood = data
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeNumber = (data) => {
        props.companyData.number = data
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeAdditionalDetails = (data) => {
        props.companyData.additional_details = data
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeZipCode = (data) => {
        props.companyData.zip_code = numberUnmasker(data, '00000-000')
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeState = (data) => {
        props.companyData.state = data[0]
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeCity = (data) => {
        props.companyData.city = data[0]
        props.onChangeCompanyData({...props.companyData})
    }

    const onSubmit = () => {
        props.onUpdateCompanyData(props.companyData).then(response => {
            if (response && response.status === 200) {
                props.setIsCompanyFormOpen()
            }
        })
    }

    const stateOptions = addressOptions.filter((addressOption, index, array) => array.findIndex(temp => temp.state === addressOption.state) === index)
                         .map(addressOption => ({ value: addressOption.state_code, label: addressOption.state }))
    const cityOptions = (!['', null].includes(props.companyData.state)) ? addressOptions.filter(addressOption=> addressOption.state_code === props.companyData.state)
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
            <div style={{ backgroundColor:'#17242D', padding: '10px 10px 10px 10px', margin: '0 3px'}}>
                <div style={{ width: '100%', marginBottom: '10px', borderRadius: '5px', backgroundColor:'#fff', padding: '10px' }}>
                    <PaymentFormFieldContainer>
                        <PaymentFormFieldLabel>
                            {'Nome'}
                        </PaymentFormFieldLabel>
                        <PaymentFormInput type={'text'} value={props.companyData.name} onChange={e=> onChangeCompanyName(e.target.value)}/>
                    </PaymentFormFieldContainer>
                    <PaymentFormFieldContainer>
                        <PaymentFormFieldLabel>
                            {'CNPJ'}
                        </PaymentFormFieldLabel>
                        <PaymentFormInput type={'text'} value={props.companyData.cnpj} onChange={e=> onChangeCompanyDocumentNumber(e.target.value)}/>
                    </PaymentFormFieldContainer>
                </div>
                <div style={{ width: '100%', borderRadius: '5px', backgroundColor:'#fff', padding: '10px' }}>
                    <PaymentFormTitleLabel>
                        {strings['pt-br']['billingPaymentFormInvoiceAddressTitleLabel']}
                    </PaymentFormTitleLabel>
                    <PaymentFormFieldContainer>
                        <PaymentFormFieldLabel>
                            {strings['pt-br']['billingPaymentFormAddressStreetFieldLabel']}
                        </PaymentFormFieldLabel>
                        <PaymentFormInput type={'text'} value={props.companyData.street} onChange={e=> onChangeStreet(e.target.value)}/>
                    </PaymentFormFieldContainer>
                    <PaymentFormFieldContainer>
                        <PaymentFormFieldLabel>
                            {strings['pt-br']['billingPaymentFormAddressNeighborhoodFieldLabel']}
                        </PaymentFormFieldLabel>
                        <PaymentFormInput type={'text'} value={props.companyData.neighborhood} onChange={e=> onChangeNeighborhood(e.target.value)}/>
                    </PaymentFormFieldContainer>
                    <PaymentFormFieldContainer>
                        <PaymentFormFieldLabel>
                            {strings['pt-br']['billingPaymentFormAddressNumberFieldLabel']}
                        </PaymentFormFieldLabel>
                        <PaymentFormInput type={'number'} placeholder={'Número'} value={props.companyData.number} onChange={e=> onChangeNumber(e.target.value)}/>
                    </PaymentFormFieldContainer>
                    <PaymentFormFieldContainer>
                        <PaymentFormFieldLabel>
                            {strings['pt-br']['billingPaymentFormAddressAdditionalInformationFieldLabel']}
                        </PaymentFormFieldLabel>
                        <PaymentFormInput type={'text'} placeholder={'Complemento'} value={props.companyData.additional_details} onChange={e=> onChangeAdditionalDetails(e.target.value)}/>
                    </PaymentFormFieldContainer>
                    <PaymentFormFieldContainer>
                        <PaymentFormFieldLabel>
                            {strings['pt-br']['billingPaymentFormAddressZipCodeFieldLabel']}
                        </PaymentFormFieldLabel>
                        <PaymentFormInput type={'text'} placeholder={'CEP'} value={numberMasker(props.companyData.zip_code, '00000-000')} onChange={e=> onChangeZipCode(e.target.value)}/>
                    </PaymentFormFieldContainer>
                    <PaymentFormFieldContainer>
                        <PaymentFormFieldLabel>
                            {strings['pt-br']['billingPaymentFormAddressStateFieldLabel']}
                        </PaymentFormFieldLabel>
                        <PaymentFormFieldSelectContainer>
                            <Select
                            fixedHeight={true}
                            options={stateOptions}
                            initialValues={stateOptions.filter(stateOption => stateOption.value === props.companyData.state)}
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
                            initialValues={cityOptions.filter(cityOption => cityOption.value === props.companyData.city)}
                            onChange={onChangeCity}
                            />
                        </PaymentFormFieldSelectContainer>
                    </PaymentFormFieldContainer>
                </div>  
                <button 
                onClick={e=> {onSubmit()}}
                style={{ border: 0, backgroundColor: '#0dbf7e', borderRadius: '20px', width: '100%', padding: '10px', marginTop: '10px' }}
                >
                    Salvar
                </button>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PaymentAddressForm