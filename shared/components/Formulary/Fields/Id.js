import React from 'react'
import { View } from 'react-native'
import { strings } from '../../../utils/constants'
import Field from '../../../styles/Formulary/Field'


const Id = (props) => {
    const renderMobile = () => {
        return (
            <View>
                {props.values.length === 0 ? (
                    <Field.Id.Description>
                        {strings['pt-br']['formularyFieldIdEmptyLabel']}
                    </Field.Id.Description>
                ): (
                    <Field.Id.Value>
                        {props.values[0].value}
                    </Field.Id.Value>
                )}
            </View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                {props.values.length === 0 ? (
                    <Field.Id.Description>
                        {strings['pt-br']['formularyFieldIdEmptyLabel']}
                    </Field.Id.Description>
                ): (
                    <Field.Id.Value>
                        {props.values[0].value}
                    </Field.Id.Value>
                )}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile() 
}
export default Id