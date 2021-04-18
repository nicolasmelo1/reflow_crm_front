import React, { useState } from 'react'
import { View } from 'react-native'
import { strings, types } from  '../../../utils/constants'
import { FormulariesEdit }  from '../../../styles/Formulary'
import { Select } from '../../Utils'

const Datetime = (props) => {
    const [dateFormatSelectIsOpen, setDateFormatSelectIsOpen] = useState(false)


    const onChangeAutoUpdate = () => {
        props.field.date_configuration_auto_update = !props.field.date_configuration_auto_update
        props.onUpdateField(props.field)
    }   

    const onChangeAutoCreate = () => {
        props.field.date_configuration_auto_create = !props.field.date_configuration_auto_create
        props.onUpdateField(props.field)
    }

    const onChangeDateFormatType = (data) => {
        props.field.date_configuration_date_format_type = data[0]
        props.onUpdateField(props.field)
    }

    const dateFormatTypes = props.types.data.field_date_format_type ? 
        props.types.data.field_date_format_type.map(dateFormatType => ({ value: dateFormatType.id, label: types('pt-br', 'date_configuration_date_format_type', dateFormatType.type)})) : []
    
    const initialDateFormat = dateFormatTypes.filter(dateFormatType => dateFormatType.value === props.field.date_configuration_date_format_type)

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <FormulariesEdit.FieldFormFieldContainer>
                    <FormulariesEdit.FieldFormLabel>
                        {'Data ou Data e hora?'}
                    </FormulariesEdit.FieldFormLabel>
                    <FormulariesEdit.SelectorContainer isOpen={dateFormatSelectIsOpen}>
                        <Select 
                            options={dateFormatTypes} 
                            initialValues={initialDateFormat} 
                            onChange={onChangeDateFormatType} 
                            setIsOpen={setDateFormatSelectIsOpen} 
                            isOpen={dateFormatSelectIsOpen}
                        />
                    </FormulariesEdit.SelectorContainer>
                </FormulariesEdit.FieldFormFieldContainer>
                <FormulariesEdit.FieldFormFieldContainer>
                    <FormulariesEdit.FieldFormCheckbox checked={props.field.date_configuration_auto_create} onChange={onChangeAutoCreate} text={strings['pt-br']['formularyEditFieldDatetimeAutoCreateCheckboxLabel']}/>
                    <FormulariesEdit.FieldFormCheckboxDivider/>
                    <FormulariesEdit.FieldFormCheckbox checked={props.field.date_configuration_auto_update} onChange={onChangeAutoUpdate} text={strings['pt-br']['formularyEditFieldDatetimeAutoUpdateCheckboxLabel']}/>
                </FormulariesEdit.FieldFormFieldContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}

export default Datetime