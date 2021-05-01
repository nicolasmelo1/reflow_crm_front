import React from 'react'
import styled from 'styled-components'
import { View, TouchableOpacity } from 'react-native'

// ------------------------------------------------------------------------------------------
export const PDFGeneratorGetMoreTemplatesButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: #0dbf7e;
    color: #17242D;
    padding: 5px 15px;
    border-radius: 5px;

    &:hover {
        background-color: #17242D;
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorGetMoreTemplatesButtonContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorEditorButtonsContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
`
:
styled(View)`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorEditorTemplatePreviewButton = process.env['APP'] === 'web' ? 
styled.button`
    margin-right: 5px;
    border-radius: 5px;
    border: 0;
    background-color: transparent;
    color: #0dbf7e;

    &:hover {
        color: #17242D;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const PDFGeneratorEditorTemplateCancelButton = process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #0dbf7e;
    background-color: transparent;
    border-radius: 5px;
    margin-right: 5px;
    padding: 5px 15px;
    color: #0dbf7e;

    &:hover {
        color: #17242D;
        border: 1px solid #17242D;
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
