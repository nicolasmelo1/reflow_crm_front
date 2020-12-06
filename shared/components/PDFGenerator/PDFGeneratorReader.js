import React, { useEffect } from 'react'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const PDFGeneratorReader = (props) => {
    const sourceRef = React.useRef(null)

    useEffect(() => {
        sourceRef.current = props.cancelToken.source()
        props.onGetPDFGeneratorTempalatesReader(sourceRef.current, props.formName)
        if (sourceRef.current) {
            sourceRef.current.cancel()
        }
    }, [])

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        console.log(props.templates)
        return (
            <div>PDFGeneratorReader</div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default PDFGeneratorReader