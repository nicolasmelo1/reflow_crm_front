import React from 'react';
import { types } from 'utils/constants';
import { Form } from 'react-bootstrap';
import Select from 'components/Utils/Select';

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
            <div style={{margin: '10px 0'}}>
                <label style={{color:'#444', margin: '0'}}>Tipo do campo</label>
                <div style={{ backgroundColor:'#fff'}}>
                    <Select 
                        options={numberMaskTypes} 
                        initialValues={initialNumberMaskType} 
                        onChange={onChangeFieldNumberMask} 
                    />
                </div>
            </div>
            <div style={{margin: '10px 0'}}>
                <label style={{color:'#444', margin: '0'}}>Formula</label>
                <Form.Control type="text"/>
            </div>
        </div>
    )
}

export default Number