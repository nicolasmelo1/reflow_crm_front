import React, { useEffect, useState } from 'react'
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
 * This component holds the data of the company that we can create invoices for him after the payment. 
 * So the information we need here is basically the address information and also the CNPJ/CPF of the company 
 * (CNPJ is for companies and CPF is for "Pessoa Juridica")
 * 
 * @param {Object} companyDataFormErrors - This object holds all the errors data where each field_name (where field name is each key of the object we send in the
 * PUT request to the server) so we can display the errors of the companyData state for the user.
 * @param {Function} setCompanyDataFormErrors - This is a function for the Billing component. This is to change the state of the 
 * `companyDataFormErrors` object in the Billing component. We use this for everytime we write in a field of the in this component formulary, 
 * this way we can dismiss the error alert on the field after the user types.
 * @param {Object} cancelToken - A axios cancel token. We use this so we can cancel a request and the promise when the user unmounts a component,
 * before the data is retrieved
 * @param {Object} companyData - The data used for the fields on this component and formulary.
 * @param {Array<Object>} addressOptions - All of the address data of the country where the user is in so he can select in the `State` and `City` options
 * in both fields. We don't leave it open because for VINDI the state should follow the ISO-3166-2 guidelines.
 * @param {Function} setIsCompanyFormOpen - This changes the `isCompanyFormOpen` state from the parent component. This state handles if this `CompanyForm`
 * component is rendered or not. Since the forms are collapsible elements, when we open we collapse and reveal this formulary to the user.
 * @param {Function} onChangeCompanyData - This is a redux action used to change the `companyData` reducer state. This ONLY changes the state.
 */
const CompanyForm = (props) => {
    const [stateOptions, setStateOptions] = useState([])
    const [cityOptions, setCityOptions] = useState([])

    /**
     * This function is responsible for retrieving the mask of the `CNPJ/CPF` field. It automatically
     * detects the size of the text and returns the mask accordingly.
     * 
     * CPF usually has 11 letters, CNPJ has 14. With this function, when the user types a 12º number
     * we automatically change the format of the number.
     * 
     * With this we can use the same field for accepting both CNPJ and CPF while also formating the number accordingly
     * 
     * @param {String} text - The text that you want to validate if it is a CPF or a CNPJ, usually this text is a string 
     * and usually this string contains only numbers.
     */
    const getCPForCNPJMask = (text) => {
        if (!text || text.length <= 11) {
            return '000.000.000-00'
        } else {
            return '00.000.000/0000-00'
        }
    }

    /**
     * This changes actually the company CNPJ/CPF in the redux function. You will notice that we use `getCPForCNPJMask` function
     * to unmask the text to the correct value.
     * 
     * @param {String} data - This is the CNPJ or the CPF as String, you send it masked and then we unmask it here.
     */
    const onChangeCompanyDocumentNumber = (data) => {
        const unmasked = numberUnmasker(data, getCPForCNPJMask(data))
        if (unmasked.length <= 14) {
            if (unmasked !== '') {
                delete props.companyDataFormErrors.cnpj
            }
            props.companyData.cnpj = unmasked
            props.setCompanyDataFormErrors({...props.companyDataFormErrors })
            props.onChangeCompanyData({...props.companyData})
        }
    }

    /**
     * This function changes the street name in the companyData in redux reducer.
     * 
     * @param {String} data - The new street name value as string
     */
    const onChangeStreet = (data) => {
        delete props.companyDataFormErrors.street
        props.companyData.street = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    /**
     * This function changes the neighborhood name in the companyData in redux reducer.
     * 
     * @param {String} data - The new neighborhood name value as string
     */
    const onChangeNeighborhood = (data) => {
        delete props.companyDataFormErrors.neighborhood
        props.companyData.neighborhood = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    /**
     * This function changes the number of the building in the street in the companyData in redux reducer.
     * Right now we don't lock the user, but this needs to accept only digits as string.
     * 
     * @param {String} data - The new number of the company value as string
     */
    const onChangeNumber = (data) => {
        delete props.companyDataFormErrors.number
        props.companyData.number = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    /**
     * This function changes the additional_details data in the companyData in redux reducer.
     * Additional details are stuff like the number of the apartment or office inside of the building, and stuff like that.
     * 
     * @param {String} data - The new additional_detail of the company value as string
     */
    const onChangeAdditionalDetails = (data) => {
        props.companyData.additional_details = data
        props.onChangeCompanyData({...props.companyData})
    }

    /**
     * Changes the zip_code data in the companyData in redux reducer. Since we work only in Brazil right now we mask the value
     * to just 8 numbers maximum since this is the CEP. Might need to change this in a future internationalization.
     * 
     * @param {String} data - The new zip_code of the company value as a masked string. We unmask when we save the value.
     */
    const onChangeZipCode = (data) => {
        delete props.companyDataFormErrors.zip_code
        props.companyData.zip_code = numberUnmasker(data, '00000-000')
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    /**
     * Changes the state name as ISO 3166-2 in the companyData in redux reducer. These are from options that we fill on the Select component for the state.
     * 
     * @param {Array<String>} data - An array containing strings, these strings are the states names as ISO-3166-2. Usually it's just
     * an array with one value that is recieved from the `Select` component. Could also be Null if the user is removing it from the selector.
     */
    const onChangeState = (data) => {
        delete props.companyDataFormErrors.state
        data = (data[0]) ? data[0] : null
        props.companyData.state = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    /**
     * Changes the city name in the companyData in redux reducer. These are from options that we fill on the Select component for the city.
     * 
     * @param {Array<String>} data - An array containing strings, these strings are the city name. Usually it's just
     * an array with one value that is recieved from the `Select` component. Could also be Null if the user is removing it from the selector.
     */
    const onChangeCity = (data) => {
        delete props.companyDataFormErrors.city
        data = (data[0]) ? data[0] : null
        props.companyData.city = data
        props.setCompanyDataFormErrors({...props.companyDataFormErrors })
        props.onChangeCompanyData({...props.companyData})
    }

    useEffect(() => {
        // sets the options for the select component so the user can select easliy the states
        setStateOptions(
            props.addressOptions
                .filter((addressOption, index, array) => array.findIndex(temp => temp.state === addressOption.state) === index)
                .map(addressOption => ({ value: addressOption.state_code, label: addressOption.state }))
        )
    }, [props.addressOptions])

    useEffect(() => {
        // sets the city options of the particular selected state, this only displays options if a state is selected, otherwise 
        // it's just an empty list
        if (!['', null].includes(props.companyData.state)) {
            setCityOptions(
                props.addressOptions
                    .filter(addressOption=> addressOption.state_code === props.companyData.state)
                    .map(addressOption => ({ value: addressOption.city, label: addressOption.city }))
            )
        } else {
            setCityOptions([])
        }
    }, [props.addressOptions, props.companyData.state])

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

export default CompanyForm