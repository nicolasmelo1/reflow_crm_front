import React, { useEffect } from 'react'
import { View } from 'react-native'
import Id from './Id'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Formula = (props) => {
    const fieldValue = (props.values.length === 0) ? '': props.values[0].value

    useEffect(() => {
        if (props.values.length > 1) {
            props.singleValueFieldsHelper(props.values[0].value)
        }
    }, [props.values])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div>
                <Id values={fieldValue && fieldValue !== '' && fieldValue !== null ? [{value: fieldValue}] : []}/>
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Formula