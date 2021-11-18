import React from 'react'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'

// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderTopButtonsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #bfbfbf;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderGoBackButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    color: #17242D;

    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderTemplateButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    color: #0dbf7e;
    padding: 0;
    margin: 0;
    display: block;
    width: 100%;
    text-align: left;

    &:hover {
        color: #17242D;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorReaderTemplatesContainer = process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) - 46px);
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
