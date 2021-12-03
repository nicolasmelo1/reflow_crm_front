import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'


export const UserModalContainer = process.env['APP'] === 'web' ?
styled.div`
    position: fixed; 
    display: flex; 
    justify-content: center; 
    align-items: center;
    top: 0;
    left: 0;
    width: var(--app-width);
    height: var(--app-height);
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 11;
    opacity: 1;
    transition: opacity 0.3s ease-in-out;
`
:
styled(View)``

export const UserModalTitle = process.env['APP'] === 'web' ? 
styled.h3`
    padding: 5px 20px;
    margin: 0;
    width: 100%;
    text-align: left;
    font-weight: bold
`
:
styled(Text)

export const UserModalFormularyHeaderContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px
`
:
styled(View)``

export const UserModalFormularyHeaderLabel = process.env['APP'] === 'web' ?
styled.p`
    text-align: left;
    padding: 0 5px;
    margin: 0 5px;
    width: calc(var(--app-width) / 4);
    font-weight: bold
`
:
styled(Text)``

export const UserModalFormularyContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    padding: 5px;
`
:
styled(View)``

export const UserModalFormularyRowsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: #fff;
    max-height: calc(var(--app-height) - 200px);
    overflow: auto;
`
:
styled(View)``

export const UserModalFormularyUserInputsRow = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    background-color: #fff;
    border-radius: 5px;
    padding: 5px;
`
:
styled(View)``

export const UserModalFormularyUserInputsErrorsRow = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 5px;
`
:
styled(View)``

export const UserModalFormularyUserInputsErrorLabel = process.env['APP'] === 'web' ? 
styled.small`
    color: red;
    margin: 0;
    width: calc(var(--app-width) / 4)
`
:
styled(Text)``

export const UserModalFormularyInput = process.env['APP'] === 'web' ? 
styled.input`
    width: calc(var(--app-width) / 4);
    margin: 5px;
    border: 1px solid ${props => props.isInvalid ? 'red': '#bfbfbf80'} !important;
    border-radius: 5px;
    padding: 10px;

` 
: 
styled(TextInput)``


export const UserModalFormularyButtonsContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    padding: 10px;

    @media(min-width: 821px) {
        flex-direction: row;
    }

    @media(max-width: 820px) {
        flex-direction: column;
    }
`
:
styled(View)``


export const UserModalFormularyAddUserButton = process.env['APP'] === 'web' ?
styled.button`
    border-radius: 5px;
    font-size: 13px;
    box-shadow: 2px 2px 16px rgb(190 205 226 / 0.4), -8px -8px 16px rgb(255 255 255 / 0.1);
    background-color: #fff;
    border: 0;
    width: 100%;
    padding: 5px 5px;
    text-align: center;
    color: #20253F;
    border-radius: 4px;

    &:hover {
        color: #20253F;
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
    &:active {
        color: #20253F;
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }

    @media(min-width: 821px) {
        width: calc(var(--app-width) / 8) !important;
    }

    @media(max-width: 820px) {
        width: 100% !important;
        margin-bottom: 10px;
    }
` 
: 
styled(TouchableOpacity)``


export const UserModalFormularySaveButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: #0dbf7e;
    border: 0;
    width: 100%;
    color: #fff;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 4px;
    box-shadow: 2px 2px 16px rgba(190, 205, 226, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1);
    font-size: 13px;

    &:hover {
        color: #20253F;
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
    &:active {
        color: #20253F;
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }

    @media(min-width: 821px) {
        width: calc(var(--app-width) / 8) !important;
    }

    @media(max-width: 820px) {
        width: 100% !important;
    }
` 
: 
styled(TouchableOpacity)``


export const UserModalFormularyExcludeUserButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    margin: 5px 0;
    user-select: none;
    border-radius: 4px;
    width: 35px;
    border: 0;

    &:hover {
        background: rgba(255, 0, 0, 0.2);
    }
`
:
styled(TouchableOpacity)``


export const UserModalFormularyExcludeIcon = styled(FontAwesomeIcon)`
    color: red
`


export const UserModalNavigationContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    display: flex; 
    flex-direction: row;
    justify-content: flex-end
`
:
styled(View)``


export const UserModalNavigationCloseModalButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    border: 0;
    background-color: transparent;
    border-radius: 50%;

    &:hover {
        background: #0dbf7e50;
    }
`
:
styled(TouchableOpacity)``