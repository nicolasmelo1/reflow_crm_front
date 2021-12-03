import React from 'react'
import styled from 'styled-components'
import { View, TouchableOpacity, Text, ScrollView } from 'react-native'

// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorButtonsContainer = process.env['APP'] === 'web' ?
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
export const PDFGeneratorCreatorGoBackButton = process.env['APP'] === 'web' ?
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
export const PDFGeneratorCreatorCreateNewButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: #0dbf7e;
    color: #20253F;
    padding: 5px 15px;
    border-radius: 5px;
    
    &:hover {
        background-color: #20253F;
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    position: absolute;
    bottom: 10px;
    right: 10px;
    height: 60px;
    width: 60px;
    z-index: 5;
    alignItems: center;
    border-radius: 50px;
    padding: 5px 10px;
    border: 0;
    background-color: #0dbf7e;
    margin-bottom: 5px;
    color: #fff;
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorCreateNewButtonLabel = process.env['APP'] === 'web' ?
styled.span``
:
styled(Text)`
    font-size: 37px;
    color: #fff;
    text-align: center;
    height: 100%;
    width: 100%
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorTemplateTitle = process.env['APP'] === 'web' ?
styled.h3`
    color: #0dbf7e;
    margin: 0;
`
:
styled(Text)`
    font-size: 24px;
    color: #0dbf7e;
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorEditTemplateButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    color: #0dbf7e;

    &:hover {
        color: #20253F;
        background-color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    width: 95%;
    height: 100%;
    flex-direction: row;
    align-items: center;
    margin: 5px 10px;
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorRemoveTemplateButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    color: red;

    &:hover {
        color: #fff;
        background-color: red;
    }
`
:
styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    height: 70px;
    background-color: red;
    margin: 1px 0 0 0;
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorTemplateCardContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0;
    padding: 5px; 
    border-radius: 5px;

    &:hover{
        background-color: #f2f2f280
    }
`
:
styled(View)`
    background-color: #fff;
    margin: 1px 0 0 0;
    padding: 15px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
`
// ------------------------------------------------------------------------------------------
export const PDFGeneratorCreatorTemplatesContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    height: calc(var(--app-height) - 50px);
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
styled(ScrollView)`
    background-color: #f2f2f2;
    height: 100%;
    flex-direction: column;
`
// ------------------------------------------------------------------------------------------