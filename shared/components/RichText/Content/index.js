import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { 
    ContentText
} from '../../../styles/RichText'

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
            <ContentText 
            draggabble="false"
            isItalic={props.content.is_italic}
            isBold={props.content.is_bold}
            isCode={props.content.is_code}
            isUnderline={props.content.is_underline}
            textColor={props.content.text_color}
            markerColor={props.content.marker_color}
            >
                {`${props.content.text}`}
            </ContentText>
        )
    }

    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Content