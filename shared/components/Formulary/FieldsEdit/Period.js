import React,  { useState } from 'react'
import { View } from 'react-native'
import { types, strings } from '../../../utils/constants'
import Select from '../../Utils/Select'
import { FormulariesEdit } from '../../../styles/Formulary'

const Period = (props) => {
    const [periodFormatSelectIsOpen, setPeriodFormatSelectIsOpen] = useState(false)

    const onChangeFieldPeriodInterval = (data) => {
        props.field.period_configuration_period_interval_type = data[0]
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const periodFormatTypes = props.types.data.field_period_interval_type ? 
        props.types.data.field_period_interval_type.map(periodIntervalType => ({ value: periodIntervalType.id, label: types('pt-br', 'period_configuration_period_format_type', periodIntervalType.type)})) : []
    
    const initialPeriodFormat = periodFormatTypes.filter(periodIntervalType => periodIntervalType.value === props.field.period_configuration_period_interval_type)
    
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
                        {strings['pt-br']['formularyEditFieldPeriodTypeSelectorLabel']}
                    </FormulariesEdit.FieldFormLabel>
                    <FormulariesEdit.SelectorContainer isOpen={periodFormatSelectIsOpen}>
                        <Select 
                            isOpen={periodFormatSelectIsOpen}
                            setIsOpen={setPeriodFormatSelectIsOpen}
                            options={periodFormatTypes} 
                            initialValues={initialPeriodFormat} 
                            onChange={onChangeFieldPeriodInterval} 
                        />
                    </FormulariesEdit.SelectorContainer>
                </FormulariesEdit.FieldFormFieldContainer>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()

}

export default Period