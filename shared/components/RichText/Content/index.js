import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { 
    ContentText
} from '../../../styles/RichText'

/**
 * This component is each content of a text. A content is an inline content of a text. It can be a bold text, a
 * italic text, underlined and so on. In other words, each content is an inline element of a text.
 * 
 * It's important to notice though that this does not handle CUSTOM CONTENTS. Custom contents are contents handled 
 * outside of the rich text, in the context they are defined. If you want to support tagging users, fields, adding dates
 * and other stuff you will need to support it outside of the rich text scope
 * 
 * @param {Object} content - check the return of `createNewContent()` on the Block component to understand the expected
 * structure.
 */
const Content = (props) => {
    //########################################################################################//
    const renderMobile = () => {
        return (
            <ContentText 
            draggabble="false"
            isItalic={props.content.is_italic}
            isBold={props.content.is_bold}
            isCode={props.content.text === '' || props.content.text === '\n' ? false : props.content.is_code}
            isUnderline={props.content.is_underline}
            textColor={props.content.text_color}
            markerColor={props.content.marker_color}
            textSize={props.content.text_size}
            >
                {`${props.content.text}`}
            </ContentText>
        )
    }
    //########################################################################################//
    const renderWeb = () => {
        return (
            <ContentText 
            draggabble="false"
            isItalic={props.content.is_italic}
            isBold={props.content.is_bold}
            isCode={props.content.text === '' || props.content.text === '\n' ? false : props.content.is_code}
            isUnderline={props.content.is_underline}
            textColor={props.content.text_color}
            markerColor={props.content.marker_color}
            textSize={props.content.text_size}
            >
                {`${props.content.text}`}
            </ContentText>
        )
    }
    //########################################################################################//
    return process.env['APP'] === 'web' ? renderWeb() : renderMobile()
}

export default Content