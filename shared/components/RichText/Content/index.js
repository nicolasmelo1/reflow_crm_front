import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

/**
 * {Description of your component, what does it do}
 * @param {Type} props - {go in detail about every prop it recieves}
 */
const Content = (props) => {


    const renderMobile = () => {
        return (
            <View></View>
        )
    }

    const renderWeb = () => {
        return (
            <span 
            draggabble="false"
            style={{fontWeight: props.content.is_bold? 'bold': 'normal', fontStyle: props.content.is_italic ? 'italic': 'normal'}}
            >
                {`${props.content.text}`}
            </span>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Content