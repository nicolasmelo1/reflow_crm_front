import React from 'react'
import styled from 'styled-components'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'

// ------------------------------------------------------------------------------------------
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

export const PDFGeneratorReaderDownloaderCustomContent = process.env['APP'] === 'web' ?
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
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderDownloaderPage = process.env['APP'] === 'web' ?
styled.div`
    box-shadow: #3c404315 0px 1px 3px 1px;
    height: calc(var(--app-height) - 52px);
    padding: 20px;
    width: 764px;
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
styled(View)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderDownloaderMultipleFieldsSeparatorLabel = process.env['APP'] === 'web' ?
styled.small`
    color: #20253F;
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInput = process.env['APP'] === 'web' ?
styled.input`
    border: 1px solid #20253F;
    border-radius: 5px;
    margin: 5px 0;
    
    &:focus {
        border: 1px solid #0dbf7e;
        outline: none;
    }
`
:
styled(TextInput)``
// ------------------------------------------------------------------------------------------
const calculateLeft = (left) => {
    if (window.innerWidth - left < 200) {
        return left-215
    } else {
        return left
    }
}

export const PDFGeneratorReaderDownloaderMultipleFieldsSeparatorInputContainer = process.env['APP'] === 'web' ?
styled.div`
    position: absolute; 
    z-index: 1;
    background-color: #fff;
    display: flex;
    padding: 10px;
    flex-direction: column;
    width: 200px;
    top: ${props => `${props.top}px`};
    left: ${props => `${calculateLeft(props.left+10)}px`};
    border-radius: 5px;
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderDownloaderMultipleFieldsSeparatorOkButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: #0dbf7e;
    border: 0;
    border-radius: 5px;
    color: #20253F;

    &:hover {
        background-color: #20253F;
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderDownloaderGoBackButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    color: #20253F;

    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderDownloaderDownloadButton = process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #20253F;
    background-color: #20253F;
    color: #0dbf7e;
    border-radius: 5px;
    padding: 5px 10px;

    &:hover {
        border: 1px solid #0dbf7e;
        background-color: #0dbf7e;
        color: #20253F;
    }  
`
:
styled(View)``
// ------------------------------------------------------------------------------------------