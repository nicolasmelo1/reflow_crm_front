import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Select } from '../Utils'
import { numberMasker, numberUnmasker } from '../../utils/numberMasker'
import { strings } from '../../utils/constants'
import { 
    BillingFormularyContainer,
    BillingFormularySectionContainer,
    BillingFormularySectionTitleLabel,
    BillingInput,
    BillingFormularyFieldSelectContainer,
    BillingFormularyFieldLabel,
    BillingFormularyFieldContainer,
    BillingFormularyRequiredField
 } from '../../styles/Billing'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PaymentAddressForm = (props) => {

    const getCPForCNPJMask = (text) => {
        if (!text || text.length <= 11) {
            return '000.000.000-00'
        } else {
            return '00.000.000/0000-00'
        }
    }

    const onChangeCompanyDocumentNumber = (data) => {
        const unmasked = numberUnmasker(data, getCPForCNPJMask(data))
        if (unmasked.length <= 14) {
            delete props.companyDataFormErrors.cnpj
            props.companyData.cnpj = unmasked
            props.setCompanyDataFormErrors({...props.companyDataFormErrors })
            props.onChangeCompanyData({...props.companyData})
        }
    }

    const onChangeStreet = (data) => {
        delete props.companyDataFormErrors.street
        props.companyData.street = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeNeighborhood = (data) => {
        delete props.companyDataFormErrors.neighborhood
        props.companyData.neighborhood = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeNumber = (data) => {
        delete props.companyDataFormErrors.number
        props.companyData.number = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeAdditionalDetails = (data) => {
        props.companyData.additional_details = data
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeZipCode = (data) => {
        delete props.companyDataFormErrors.zip_code
        props.companyData.zip_code = numberUnmasker(data, '00000-000')
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeState = (data) => {
        delete props.companyDataFormErrors.state
        data = (data[0]) ? data[0] : null
        props.companyData.state = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    const onChangeCity = (data) => {
        delete props.companyDataFormErrors.city
        data = (data[0]) ? data[0] : null
        props.companyData.city = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    const stateOptions = props.addressOptions.filter((addressOption, index, array) => array.findIndex(temp => temp.state === addressOption.state) === index)
                         .map(addressOption => ({ value: addressOption.state_code, label: addressOption.state }))
    const cityOptions = (!['', null].includes(props.companyData.state)) ? props.addressOptions.filter(addressOption=> addressOption.state_code === props.companyData.state)
                        .map(addressOption => ({ value: addressOption.city, label: addressOption.city })) : []


    const renderMobile = () => {
        return (
            <View/>
        )
    }
    
    const renderWeb = () => {
        return (
            <BillingFormularyContainer>
                <BillingFormularySectionContainer>
                    <BillingFormularyFieldContainer>
                        <BillingFormularyFieldLabel>
                            {strings['pt-br']['billingCompanyFormularyCNPJAndCPFFieldLabel']}
                            <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                        </BillingFormularyFieldLabel>
                        <BillingInput 
                        errors={Array.from(Object.keys(props.companyDataFormErrors)).includes('cnpj')}
                        type={'text'} 
                        value={numberMasker(props.companyData.cnpj, getCPForCNPJMask(props.companyData.cnpj))} 
                        onChange={e=> onChangeCompanyDocumentNumber(e.target.value)}
                        />
                    </BillingFormularyFieldContainer>
                </BillingFormularySectionContainer>
                <BillingFormularySectionContainer>
                    <BillingFormularySectionTitleLabel>
                        {strings['pt-br']['billingCompanyFormularyAddressSectionTitleLabel']}
                    </BillingFormularySectionTitleLabel>
                    <BillingFormularyFieldContainer>
                        <BillingFormularyFieldLabel>
                            {strings['pt-br']['billingCompanyFormularyStreetFieldLabel']}
                            <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                        </BillingFormularyFieldLabel>
                        <BillingInput                         
                        errors={Array.from(Object.keys(props.companyDataFormErrors)).includes('street')}
                        type={'text'} 
                        value={props.companyData.street} 
                        onChange={e=> onChangeStreet(e.target.value)}
                        />
                    </BillingFormularyFieldContainer>
                    <BillingFormularyFieldContainer>
                        <BillingFormularyFieldLabel>
                            {strings['pt-br']['billingCompanyFormularyNeighborhoodFieldLabel']}
                            <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                        </BillingFormularyFieldLabel>
                        <BillingInput                         
                        errors={Array.from(Object.keys(props.companyDataFormErrors)).includes('neighborhood')}
                        type={'text'} 
                        value={props.companyData.neighborhood} 
                        onChange={e=> onChangeNeighborhood(e.target.value)}
                        />
                    </BillingFormularyFieldContainer>
                    <BillingFormularyFieldContainer>
                        <BillingFormularyFieldLabel>
                            {strings['pt-br']['billingCompanyFormularyNumberFieldLabel']}
                            <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                        </BillingFormularyFieldLabel>
                        <BillingInput 
                        errors={Array.from(Object.keys(props.companyDataFormErrors)).includes('number')}
                        type={'number'} 
                        value={props.companyData.number} 
                        onChange={e=> onChangeNumber(e.target.value)}
                        />
                    </BillingFormularyFieldContainer>
                    <BillingFormularyFieldContainer>
                        <BillingFormularyFieldLabel>
                            {strings['pt-br']['billingCompanyFormularyAdditionalInformationFieldLabel']}
                        </BillingFormularyFieldLabel>
                        <BillingInput
                        type={'text'} 
                        value={props.companyData.additional_details} 
                        onChange={e=> onChangeAdditionalDetails(e.target.value)}
                        />
                    </BillingFormularyFieldContainer>
                    <BillingFormularyFieldContainer>
                        <BillingFormularyFieldLabel>
                            {strings['pt-br']['billingCompanyFormularyZipCodeFieldLabel']}
                            <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                        </BillingFormularyFieldLabel>
                        <BillingInput 
                        errors={Array.from(Object.keys(props.companyDataFormErrors)).includes('zip_code')}
                        type={'text'} 
                        placeholder={'00000-000'} 
                        value={numberMasker(props.companyData.zip_code, '00000-000')} 
                        onChange={e=> onChangeZipCode(e.target.value)}
                        />
                    </BillingFormularyFieldContainer>
                    <BillingFormularyFieldContainer>
                        <BillingFormularyFieldLabel>
                            {strings['pt-br']['billingCompanyFormularyStateFieldLabel']}
                            <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                        </BillingFormularyFieldLabel>
                        <BillingFormularyFieldSelectContainer
                        errors={Array.from(Object.keys(props.companyDataFormErrors)).includes('state')}
                        >
                            <Select
                            fixedHeight={true}
                            options={stateOptions}
                            initialValues={stateOptions.filter(stateOption => stateOption.value === props.companyData.state)}
                            onChange={onChangeState}
                            />
                        </BillingFormularyFieldSelectContainer>
                    </BillingFormularyFieldContainer>
                    <BillingFormularyFieldContainer>
                        <BillingFormularyFieldLabel>
                            {strings['pt-br']['billingCompanyFormularyCityFieldLabel']}
                            <BillingFormularyRequiredField>*</BillingFormularyRequiredField>
                        </BillingFormularyFieldLabel>
                        <BillingFormularyFieldSelectContainer
                        errors={Array.from(Object.keys(props.companyDataFormErrors)).includes('city')}
                        >
                            <Select
                            fixedHeight={true}
                            options={cityOptions}
                            initialValues={cityOptions.filter(cityOption => cityOption.value === props.companyData.city)}
                            onChange={onChangeCity}
                            />
                        </BillingFormularyFieldSelectContainer>
                    </BillingFormularyFieldContainer>
                </BillingFormularySectionContainer>  
            </BillingFormularyContainer>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PaymentAddressForm