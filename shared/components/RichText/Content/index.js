import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Content = (props) => {
    const inputRef = React.useRef(null)
    const onWriteText = (e) => {
        props.onChange(inputRef.current.textContent)
    }

    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <div ref={inputRef} onInput={onWriteText} contentEditable={true} suppressContentEditableWarning={true} style={{display: 'inline-block', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: props.content.is_bold? 'bold': 'normal'}}>
                {props.content.text}
            </div>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Content