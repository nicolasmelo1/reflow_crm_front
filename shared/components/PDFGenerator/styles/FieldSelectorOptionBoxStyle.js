import React from 'react'
import styled from 'styled-components'
import { ScrollView, TouchableOpacity, Text, TextInput } from 'react-native'

// ------------------------------------------------------------------------------------------
const calculateLeft = (left) => {
    if (window.innerWidth - left < 200) {
        return left-215
    } else {
        return left
    }
}

export const FieldOptionsContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 200px;
    background-color: #ffffff;
    overflow-y: auto;
    position: absolute;
    transform: translate3d(0px, ${props=> props.translate.toString()}px, 0px);
    top: ${props => props.top}px;
    left: ${props => calculateLeft(props.left)}px;
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px;
    border: 1px solid #bfbfbf;
    padding: 5px 0;
    border-radius: 5px;
    height: 400px;
    z-index: 11;

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
    padding: 10px;
    height: 92%;
`
// ------------------------------------------------------------------------------------------
export const FieldOptionsButtons = process.env['APP'] === 'web' ? styled.button`
    display: block;
    border: 0;
    background-color: transparent;
    color: #20253F;
    width: 100%;
    text-align: left;
    padding: 5px;
    font-size: 12px;

    &:hover {
        background-color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    padding: 10px; 
    ${props => props.isFirst ? `` : `
        border-top-width: 1px;
        border-top-color: #f2f2f2;
    `}
`
// ------------------------------------------------------------------------------------------
export const FieldOptionsFormularyTitle = process.env['APP'] === 'web' ?
styled.p`
    margin: 0 5px;
    color: #bfbfbf;
`
:
styled(Text)`
    font-size: 24px;
    color: #bfbfbf;
`
// ------------------------------------------------------------------------------------------
export const FieldOptionsSearchBox = process.env['APP'] === 'web' ?
styled.input`
    border-radius: 5px;
    margin: 5px;
    width: 95%;
`
:
styled(TextInput)``
// ------------------------------------------------------------------------------------------
