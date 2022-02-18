import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

// ------------------------------------------------------------------------------------------
export const FormularyContainer = process.env['APP'] === 'web' ?
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
export const FormularyFieldContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%; 
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`
:
styled(View)`
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 15px;
`
// ------------------------------------------------------------------------------------------
export const FormularyFieldLabel = process.env['APP'] === 'web' ?
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
export const FormularyLogoContainer = process.env['APP'] === 'web' ?
styled.label`
    margin-top: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const FormularyLogoHelperLabel = process.env['APP'] === 'web' ?
styled.small`
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translate(0,-50%);
    text-align:center;
    color: #20253F;
    font-weight: bold;
    background-color: #fff;
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const FormularyLogo = process.env['APP'] === 'web' ?
styled.img`
    max-width:100%;
    max-height:100%;
`
:
styled(Image)`
    width: 150px;
    height: 150px;
    resize-mode: contain;
    border-radius: 5px;
`
// ------------------------------------------------------------------------------------------
export const FormularySaveButton = process.env['APP'] === 'web' ?
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
export const FormularySaveButtonText = process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    color: #20253F;
    width: 100%;
    text-align: center;
`
:
styled(Text)`
    color: #20253F;
`