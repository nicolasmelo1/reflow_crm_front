import React from 'react';
import { types, strings } from 'utils/constants';
import Select from 'components/Utils/Select';
import { FormulariesEdit } from 'styles/Formulary'

const Number = (props) => {
    const initialNumberMaskType = (props.field.number_configuration_number_format_type && props.types.data.field_number_format_type) ? props.types.data.field_number_format_type
        .filter(numberFormatType=> numberFormatType.id === props.field.number_configuration_number_format_type)
        .map(numberFormatType=> { return { value: numberFormatType.id, label: types('pt-br', 'number_configuration_number_format_type', numberFormatType.type) } }) : []
    const numberMaskTypes = (props.types && props.types.data && props.types.data.field_number_format_type) ? props.types.data.field_number_format_type
        .map(numberFormatType=> { return { value: numberFormatType.id, label: types('pt-br', 'number_configuration_number_format_type', numberFormatType.type) } }): []
    
    const onChangeFieldNumberMask = (data) => {
        props.field.number_configuration_number_format_type = data[0]
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    return (
        <div>
            <FormulariesEdit.FieldFormFieldContainer>
                <FormulariesEdit.FieldFormLabel>
                    {strings['pt-br']['formularyEditFieldNumberTypeSelectorLabel']}
                </FormulariesEdit.FieldFormLabel>
                <FormulariesEdit.SelectorContainer>
                    <Select 
                        options={numberMaskTypes} 
                        initialValues={initialNumberMaskType} 
                        onChange={onChangeFieldNumberMask} 
                    />
                </FormulariesEdit.SelectorContainer>
            </FormulariesEdit.FieldFormFieldContainer>
            <FormulariesEdit.FieldFormFieldContainer>
                <FormulariesEdit.FieldFormLabel>
                    {strings['pt-br']['formularyEditFieldNumberFormulaLabel']}
                </FormulariesEdit.FieldFormLabel>
                <FormulariesEdit.InputField type="text"/>
            </FormulariesEdit.FieldFormFieldContainer>
        </div>
    )
}

export default Number