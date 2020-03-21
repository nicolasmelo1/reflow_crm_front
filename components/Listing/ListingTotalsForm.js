import React, { useState, useEffect } from 'react'
import Select from 'components/Utils/Select'
import { types, strings } from 'utils/constants'
import { ListingTotalFormTitle, ListingTotalFormSelectContainer, ListingTotalFormLabel, ListingTotalFormContainer, ListingTotalFormSaveButton, ListingTotalFormCancelButton } from 'styles/Listing'

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
        if (props.headers.fields) {
            setFieldOptions(props.headers.fields.map(field=> ({value: field.id, label: field.label_name})))
        }
    }, [props.headers.fields])

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