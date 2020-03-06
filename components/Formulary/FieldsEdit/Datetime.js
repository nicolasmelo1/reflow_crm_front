import React from 'react'
import { strings } from  'utils/constants'
import { FormulariesEdit }  from 'styles/Formulary'

const Datetime = (props) => {
    const onChangeAutoUpdate = () => {
        props.field.date_configuration_auto_update = !props.field.date_configuration_auto_update
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }   

    const onChangeAutoCreate = () => {
        props.field.date_configuration_auto_create = !props.field.date_configuration_auto_create
        props.onUpdateField(props.sectionIndex, props.fieldIndex, props.field)
    }

    return (
        <div>
            <FormulariesEdit.FieldFormFieldContainer>
                <div style={{ backgroundColor:'#fff',  padding: '10px 5px'}}>
                    <FormulariesEdit.FieldFormCheckboxLabel>
                        <input type="checkbox" checked={props.field.date_configuration_auto_create} onChange={e => {onChangeAutoCreate()}}/>&nbsp;{strings['pt-br']['formularyEditFieldDatetimeAutoCreateCheckboxLabel']}
                    </FormulariesEdit.FieldFormCheckboxLabel>
                </div>
                <div style={{ backgroundColor:'#fff', padding: '10px 5px', borderTop: '1px solid #bfbfbf'}}>
                    <FormulariesEdit.FieldFormCheckboxLabel>
                        <input type="checkbox" checked={props.field.date_configuration_auto_update} onChange={e => {onChangeAutoUpdate()}}/>&nbsp;{strings['pt-br']['formularyEditFieldDatetimeAutoUpdateCheckboxLabel']}
                    </FormulariesEdit.FieldFormCheckboxLabel>
                </div>
            </FormulariesEdit.FieldFormFieldContainer>
        </div>
    )
}

export default Datetime