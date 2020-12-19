import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'


export default process.env['APP'] === 'web' ?
styled.div`
    display: inline-block;
    white-space: pre-wrap;
    word-break: break-word;
    padding: 5px;
    width: 100%;
    outline: none !important;
    caret-color: ${props => ![null, '', undefined].includes(props.caretColor) ? props.caretColor : '#000'};
    text-align: ${props => props.alignmentType };
    
    &:empty:before {
        content: attr(placeholder);
        pointer-events: none;
        display: block;
    }
`
:
styled(TextInput)`
    color: transparent;
    padding: 5px;
`