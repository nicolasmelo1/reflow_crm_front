import React from 'react'
import styled from 'styled-components'
import { View, TouchableOpacity, Text, TextInput } from 'react-native'

// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorEditorTemplateTitleContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorEditorTemplateCancelButton = process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #0dbf7e;
    background-color: transparent;
    border-radius: 5px;
    margin-right: 5px;
    padding: 5px 15px;
    color: #0dbf7e;

    &:hover {
        color: #20253F;
        border: 1px solid #20253F;
    }
`
:
styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorEditorTemplateSaveButton = process.env['APP'] === 'web' ?
styled.button`
    cursor: pointer !important;
    border: ${props => props.isValid ? '1px solid #0dbf7e' : '1px solid #f2f2f2'};
    background-color: ${props => props.isValid ? '#0dbf7e' : '#f2f2f2'};
    padding: 5px 15px;
    border-radius: 5px;
    margin-right: 5px;
    color: ${props => props.isValid ? '#20253F' : '#bfbfbf'};

    ${props => props.isValid ? `
        &:hover {
            color: #0dbf7e;
            border: 1px solid #20253F;
            background-color: #20253F;
        }
    ` : ''}
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorEditorTemplateTitleInput = process.env['APP'] === 'web' ?
styled.input`
    font-size: 1.75rem;
    color: ${props => props.isValid ? '#0dbf7e' : 'red'};
    border-right: 0;
    border-top: 0;
    border-left: 0;
    border-bottom: ${props => props.isValid ? '0' : '1px solid red'};
    background-color: transparent;
    margin-bottom: 5px;
    width: 100%;
    
    &:focus {
        outline: none;
    }
`
:
styled(TextInput)`
    color: #0dbf7e;
    border-bottom-color: #0dbf7e;
    border-bottom-width: 1px; 
    max-width: 93%
`
// ------------------------------------------------------------------------------------------
const getTextColor = (props) => {
    if (props.textColor) {
        return props.textColor
    } else {
        return props.isCode ? 'red' : '#000'
    }
}

const isBold = (props) => props.isBold ? 'bold': 'normal'
const isItalic = (props) => props.isItalic ? 'italic': 'normal'
const isUnderline = (props) => props.isUnderline ? `1px solid ${getTextColor(props)}` : 'none'

export const PDFGeneratorCreatorEditorCustomContent = process.env['APP'] === 'web' ?
styled.span`
    font-weight: ${props=> isBold(props)};
    font-style: ${props => isItalic(props)};
    border-bottom: ${props => isUnderline(props)};
    color: ${props => getTextColor(props)};
    background-color: #f2f2f2;
    padding: ${props=> props.isCode ? '0 3px': '0 2px'};
    margin: ${props=> props.isCode ? '0 2px': '0'};
    border-radius: ${props=> props.isCode ? '3px' : '3px'};
    font-size: ${props => ![null, '', undefined].includes(props.textSize) ? `${props.textSize}pt` : '12pt' };
`
:
styled(Text)`
    font-weight: ${props=> isBold(props)};
    font-style: ${props => isItalic(props)};
    color: ${props => getTextColor(props)};
    background-color: #f2f2f2;
    padding: ${props=> props.isCode ? '0 3px': '0 2px'};
    margin: ${props=> props.isCode ? '0 2px': '0'};
    border-radius: ${props=> props.isCode ? '3px' : '3px'};
    font-size: ${props => ![null, '', undefined].includes(props.textSize) ? `${props.textSize*1.2}px` : `${12*1.2}pt` };
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorEditorRichTextContainer = process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) - 108px);
    box-shadow: #3c404315 0px 1px 3px 1px;
    padding: 70px;
    max-width: 764px;
    background-color: #fff;
    margin: auto;
    overflow: auto;

    scrollbar-color: #bfbfbf transparent;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 5px;
    }

    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 8px;
        height: 8px;
        background-color: transparent;
    }
`
:
styled(View)`
    height: ${props => {
        return props.height - (43 * PixelRatio.get())
    }
    }px
`
// ------------------------------------------------------------------------------------------