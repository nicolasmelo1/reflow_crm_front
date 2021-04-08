import React from 'react'
import styled from 'styled-components'
import { View, TextInput, Text, TouchableOpacity, Image } from 'react-native'

// ------------------------------------------------------------------------------------------
export const CompanyFormularyContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px
`
:
styled(View)`
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px 0
`
// ------------------------------------------------------------------------------------------
export const CompanyFormularyFieldContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%; 
    padding: 10px 0
`
:
styled(View)`
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 15px;
`
// ------------------------------------------------------------------------------------------
export const CompanyFormularyFieldInput = process.env['APP'] === 'web' ? 
styled.input`
    border: 0;
    background-color: white !important;
    color: #17242D;
    border: 2px solid ${props=> props.errors ? 'red': '#f2f2f2'};
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-clip: padding-box;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;

    &:focus {
        color: #17242D;
        background-color: white;
        border: 2px solid #17242D;
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)`
    background-color: white !important;
    border-radius: 4px;
    padding: 5px;
    min-height: 30px;
    color: #17242D;
    border: 1px solid ${props=> props.errors ? 'red': '#0dbf7e'};
`
// ------------------------------------------------------------------------------------------
export const CompanyFormularyFieldLabel = process.env['APP'] === 'web' ?
styled.label`
    margin: 0;
    padding: 0; 
    font-weight: bold
`
:
styled(Text)`
    margin-bottom: 5px;
    font-weight: bold;
`
// ------------------------------------------------------------------------------------------
export const CompanyFormularyFieldError = process.env['APP'] === 'web' ?
styled.small`
    color: red
`
:
styled(Text)`
    color: red;
    font-size: 10px;
`
// ------------------------------------------------------------------------------------------
export const CompanyFormularySaveButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: #0dbf7e;
    border: 1px solid #0dbf7e;
    border-radius: 20px;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px
`
:
styled(TouchableOpacity)`
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 15px 0;
    align-items: center;
    background-color: #0dbf7e;
    border-radius: 5px;
    border-width: 1px;
    border-color: #0dbf7e
`
// ------------------------------------------------------------------------------------------
export const CompanyFormularySaveButtonText = process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    color: #17242D;
    width: 100%;
    text-align: center;
`
:
styled(Text)`
    color: #17242D;
`
// ------------------------------------------------------------------------------------------
export const CompanyFormularyLogoContainer = process.env['APP'] === 'web' ?
styled.label`
    position: relative;
    display: block;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const CompanyFormularyLogoHelperLabel = process.env['APP'] === 'web' ?
styled.small`
    position: absolute;
    width: 150px;
    top: 50%;
    transform: translate(0,-50%);
    text-align:center;
    color: #17242D;
    font-weight: bold;
    background-color: #fff;
    margin: 0;
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const CompanyFormularyLogo = process.env['APP'] === 'web' ?
styled.img`
    width: 150px;
    border-radius: 5px;
`
:
styled(Image)`
    width: 150px;
    height: 150px;
    resize-mode: contain;
    border-radius: 5px;
`
// ------------------------------------------------------------------------------------------
