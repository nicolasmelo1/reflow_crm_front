import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

const getTextColor = (props) => {
    if (props.textColor) {
        return props.textColor
    } else {
        return props.isCode ? 'red' : '#000'
    }
}
const getBackgroundColor = (props) => {
    if (props.markerColor) {
        return props.markerColor
    } else {
        return props.isCode ? '#f2f2f2' : 'transparent'
    }
}
const isBold = (props) => props.isBold ? 'bold': 'normal'
const isItalic = (props) => props.isItalic ? 'italic': 'normal'
const isUnderline = (props) => props.isUnderline ? `1px solid ${getTextColor(props)}` : 'none'

export default process.env['APP'] === 'web' ?
styled.button`
    text-align: inherit;
    font-weight: ${props=> isBold(props)};
    font-style: ${props => isItalic(props)};
    border-bottom: ${props => isUnderline(props)};
    background-color: ${props => getBackgroundColor(props)};
    color: ${props => getTextColor(props)};
    padding: ${props=> props.isCode ? '0 3px': '0 2px'};
    margin: ${props=> props.isCode ? '0 2px': '0'};
    border-radius: ${props=> props.isCode ? '3px' : '3px'};
    border-top: 0;
    border-left: 0;
    border-right: 0;
    font-size: ${props => ![null, '', undefined].includes(props.textSize) ? `${props.textSize}pt` : '12pt' };

    &:hover {
        background-color: #0dbf7e50;
    }
`
:
styled(Text)``