import React, { useState, useEffect } from 'react'
import Select from '../Utils/Select'
import { types, strings } from '../../utils/constants'
import { ListingTotalFormTitle, ListingTotalFormSelectContainer, ListingTotalFormLabel, ListingTotalFormContainer, ListingTotalFormSaveButton, ListingTotalFormCancelButton } from '../../styles/Listing'


/**
 * To create a new card of totals of a field the user first needs to fill a little formulary selecting the
 * field and the number format.
 * 
 * @param {String} formName - the name of the formulary the user is in, we can get this from the url parameters.
 * @param {Object} params - the parameters of the listing, parameters define the filter, the sort, the date range
 * and many other stuff. We use this to get the totals again when the user creates a new total.
 * @param {Object} headers - object containing primarly all of the fields in the header. This is used to build the 
 * selection of the fields.
 * @param {Object} types - the types state, this types are usually the required data from this system to work. 
 * Types defines all of the field types, form types, format of numbers and dates and many other stuff
 * @param {Function} setIsOpenedTotalsForm - set `isOpenedTotalsForm` state in the parent component, this variable
 * is used to close or open this component.
 * @param {Function} onGetTotals - make a request to the backend to retrieve the totals data.
 * @param {Function} onCreateTotal - make a request to the backend to post and create a new total.
 */
const ListingTotalsForm = (props) => {
    const [selectedNumberFormat, setSelectedNumberFormat] = useState([])
    const [selectedField, setSelectedField] = useState([])
    const [fieldOptions, setFieldOptions] = useState([])
    const [numberFormatOptions, setNumberFormatOptions] = useState([])

    const onChangeFieldOption = (data) => {
        setSelectedField(fieldOptions.filter(field=> data.includes(field.value)))
    }

    const onChangeNumberFormat = (data) => {
        setSelectedNumberFormat(numberFormatOptions.filter(numberFormatType=> data.includes(numberFormatType.value)))
    }

    const onSubmit = () => {
        const data = {
            field_id: parseInt(selectedField[0].value),
            number_configuration_number_format_type_id: parseInt(selectedNumberFormat[0].value)
        }
        props.onCreateTotal(data, props.formName)
        props.onGetTotals(props.params, props.formName)
        props.setIsOpenedTotalsForm(false)
    }

    useEffect(() => {
        if (props.headers.field_headers) {
            setFieldOptions(props.headers.field_headers.map(field=> ({value: field.id, label: field.label_name})))
        }
    }, [props.headers.field_headers])

    useEffect(() => {
        if (props.types.data.field_number_format_type) {
            setNumberFormatOptions(
                props.types.data.field_number_format_type
                    .filter(numberFormatType=> numberFormatType.type !=='percentage')
                    .map(numberFormatType=> ({value: numberFormatType.id, label: types('pt-br', 'number_configuration_number_format_type', numberFormatType.type)}))
            )
        }
    }, [props.types.data.field_number_format_type])

    return (
        <ListingTotalFormContainer>
            <ListingTotalFormTitle>{strings['pt-br']['listingTotalFormTitleLabel']}</ListingTotalFormTitle>
            <ListingTotalFormLabel>{strings['pt-br']['listingTotalFormFieldSelectLabel']}</ListingTotalFormLabel>
            <ListingTotalFormSelectContainer>
                <Select 
                options={fieldOptions} 
                onChange={onChangeFieldOption} 
                initialValues={selectedField}
                /> 
            </ListingTotalFormSelectContainer>
            <ListingTotalFormLabel>{strings['pt-br']['listingTotalFormFieldSelectLabel']}</ListingTotalFormLabel>
            <ListingTotalFormSelectContainer>
                <Select 
                options={numberFormatOptions} 
                onChange={onChangeNumberFormat} 
                initialValues={selectedNumberFormat}
                /> 
            </ListingTotalFormSelectContainer>
            <div>
                <ListingTotalFormCancelButton onClick={e=> {props.setIsOpenedTotalsForm(false)}}>{strings['pt-br']['listingTotalFormCancelButtonLabel']}</ListingTotalFormCancelButton>
                <ListingTotalFormSaveButton onClick={e=> {onSubmit()}}>{strings['pt-br']['listingTotalFormSaveButtonLabel']}</ListingTotalFormSaveButton>
            </div>
        </ListingTotalFormContainer>
    )
}

export default ListingTotalsForm