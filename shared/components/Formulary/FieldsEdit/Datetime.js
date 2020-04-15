import React from 'react'
import { strings } from  '../../../utils/constants'
import { FormulariesEdit }  from '../../../styles/Formulary'

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
                <FormulariesEdit.FieldFormCheckbox checked={props.field.date_configuration_auto_create} onChange={onChangeAutoCreate} text={strings['pt-br']['formularyEditFieldDatetimeAutoCreateCheckboxLabel']}/>
                <FormulariesEdit.FieldFormCheckboxDivider/>
                <FormulariesEdit.FieldFormCheckbox checked={props.field.date_configuration_auto_update} onChange={onChangeAutoUpdate} text={strings['pt-br']['formularyEditFieldDatetimeAutoUpdateCheckboxLabel']}/>
            </FormulariesEdit.FieldFormFieldContainer>
        </div>
    )
}

export default Datetime