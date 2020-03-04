import React, { useState } from 'react'
import { strings } from  'utils/constants'

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
            <div style={{margin: '10px 0'}}>
                <div style={{ backgroundColor:'#fff',  padding: '10px 5px'}}>
                    <label style={{ margin: '0' }}>
                        <input type="checkbox" checked={props.field.date_configuration_auto_create} onChange={e => {onChangeAutoCreate()}}/>{strings['pt-br']['formularyEditFieldDatetimeAutoCreateCheckboxLabel']}
                    </label>
                </div>
                <div style={{ backgroundColor:'#fff', padding: '10px 5px', borderTop: '1px solid #bfbfbf'}}>
                    <label style={{ margin: '0' }}>
                        <input type="checkbox" checked={props.field.date_configuration_auto_update} onChange={e => {onChangeAutoUpdate()}}/>{strings['pt-br']['formularyEditFieldDatetimeAutoUpdateCheckboxLabel']}
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Datetime