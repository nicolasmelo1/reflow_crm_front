import React, { useState } from 'react'
import Fields from './Fields'
import { FormulariesEdit }  from 'styles/Formulary'
import { Form } from 'react-bootstrap'
import { types } from 'utils/constants'
import Select from 'components/Utils/Select';

const FieldOption = (props) => {
    return (
        <div>
            {props.name}
        </div>
    )
}


const FormularyFieldEdit = (props) => {
    const [isEditing, setIsEditing] = useState(false)

    const initialFieldType = (props.field.type && props.types.data.field_type) ? props.types.data.field_type.filter(fieldType=> fieldType.id === props.field.type).map(fieldType=> { return { value: fieldType.id, label: types('pt-br', 'field_type', fieldType.type) } }) : []
    const fieldTypes = (props.types && props.types.data && props.types.data.field_type) ? props.types.data.field_type.map(fieldType=> 
        { 
            return { 
                value: fieldType.id, 
                label: { 
                    props: {
                        name: types('pt-br', 'field_type', fieldType.type) 
                    } 
                }
            }
        }
    ): []
        
    const onChangeFieldName = (e) => {
        e.preventDefault();
        props.field.label_name = e.target.value
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    const onChangeFieldType = (data) => {
        props.field.type = data[0]
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }
    
    const onFilterFieldType = (value) => {
        return (props.types && props.types.data && props.types.data.field_type) ? props.types.data.field_type
        .filter(fieldType=> types('pt-br', 'field_type', fieldType.type).includes(value))
        .map(fieldType=> 
            { 
                return { 
                    value: fieldType.id, 
                    label: { 
                        props: {
                            name: types('pt-br', 'field_type', fieldType.type) 
                        } 
                    }
                }
            }
        ): []
    }



    return (
        <div style={{borderTop: '2px solid #bfbfbf', padding: '5px'}}>
            <div style={{height: '1em', margin: '5px'}}>
                <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="trash"/>
                <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="eye"/>
                <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="arrows-alt" />
                <FormulariesEdit.Icon.FieldIcon size="sm" type="form" icon="pencil-alt" onClick={e=> {setIsEditing(!isEditing)}}/>
                    
            </div>
            {isEditing ? (
                <div style={{ width: '100%', backgroundColor: '#bfbfbf', padding: '5px 10px'}}>
                    <div style={{margin: '10px 0'}}>
                        <label style={{color:'#444', margin: '0'}}>Tipo do campo</label>
                        <div style={{ backgroundColor:'#fff'}}>
                            <Select 
                                onFilter={onFilterFieldType}
                                label={FieldOption}
                                options={fieldTypes} 
                                initialValues={initialFieldType} 
                                onChange={onChangeFieldType} 
                            />
                        </div>
                    </div>
                    <div style={{margin: '10px 0'}}>
                        <label style={{color:'#444', margin: '0'}}>Nome do campo</label>
                        <Form.Control type="text" value={props.field.label_name} onChange={e=> {onChangeFieldName(e)}}/>
                    </div>
                    <div style={{margin: '10px 0'}}>
                        <div style={{ backgroundColor:'#fff'}}>
                            <input type="checkbox"/>Teste
                        </div>
                    </div>
                </div>
            ): (
                <Fields 
                errors={{}}
                field={props.field}
                types={props.types}
                fieldFormValues={[]}
                />
            )}
        </div>
    )
}

export default FormularyFieldEdit