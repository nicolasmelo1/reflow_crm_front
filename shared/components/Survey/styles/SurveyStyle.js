import styled from 'styled-components'
import { Text, View, TouchableOpacity } from 'react-native'



export const SurveyContainer = process.env['APP'] === 'web' ? 
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
    overflow: auto;
`
:
styled(View)``


export const SurveyBoxContainer = process.env['APP'] === 'web' ?
styled.div`
    width: calc(var(--app-width) / 2);
    background-color: white;
    border-radius: 5px;
    padding: 10px;
    transition: transform 0.3s ease-in-out;
    white-space: normal !important;
`
:
styled(View)``

export const SurveyTitleContainer = process.env['APP'] === 'web' ?
styled.div`
    padding: 10px;
    width: 100%;
    background-color: #f2f2f2;
    color: #20253F !important;
    border-radius: 5px;
    text-align: center;
`
:
styled(View)``

export const SurveyQuestion = process.env['APP'] === 'web' ?
styled.h5`
    padding: 10px;
    margin-bottom: 0;
    width: 100%;
    color: #686b70 !important;
    border-radius: 5px;
    text-align: left;
`
:
styled(Text)``

export const SurveyOptionContainer = process.env['APP'] === 'web' ?
styled.button`
    padding: 10px;
    width: 100%;
    border: 0;
    margin: 5px 0;
    background-color: ${props => props.selected ? '#0dbf7e' : '#0dbf7e30'};
    color: #20253F;
    font-weight: ${props => props.selected ? 'bold' : 'normal'};
    border-radius: 5px;
    text-align: left;
    
    &:hover {
        background-color: #0dbf7e !important;
    }
`
:
styled(TouchableOpacity)``

export const SurveyQuestionOptionsContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: column
` 
: 
styled(View)``

export const SurveyHeaderContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
`
: 
styled(View)``

export const SurveyCloseButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #686b70;
    font-size: 20px;
    border-radius: 4px;
    font-weight: bold;
    padding: 0;
    margin: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
    outline: none;

    &:hover {
        background-color: #bfbfbf60;
    }
`
:
styled(TouchableOpacity)``

export const SurveyTextInput = process.env['APP'] === 'web' ?
styled.textarea`
    border: 0;
    width: 100%;
    padding: 10px;
    background-color: white !important;
    color: #6a7074;
    border: 2px solid #F2F2F2 !important;

    &:focus {
        color: #6a7074;
        background-color: white;
        border: 2px solid #0dbf7e !important;
        box-shadow: none !important;
        outline: 0;
    }
`
:
styled(TextInput)``

export const SurveySubmitButtonContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
`
:
styled(View)``

export const SurveySubmitButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row;
    border: 0;
    background-color: ${props => props.disabled ? '#f2f2f2': '#0dbf7e'};
    padding: 10px;
    border-radius: 5px;

    &:hover {
        background-color: ${props => props.disabled ? '#f2f2f2': '#0dbf7e50'};
    }
`
:
styled(TouchableOpacity)``


export const SurveyLikertContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column
`
:
styled(View)``

export const SurveyLikertHeadersContainer = process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between
`
:
styled(View)``

export const SurveyLikertHeaderLabel = process.env['APP'] === 'web' ?
styled.span`
    font-weight: bold;
    color: #20253F;
`
:
styled(Text)``


export const SurveyLikertScaleContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    width: 100%
`
:
styled(View)``

export const SurveyLikertScaleButtons = process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #0dbf7e60;
    text-align: center;
    width: 100%;
    border-radius: 4px;
    margin: 2px;
    background-color: ${props => props.selected ? '#0dbf7e' : '#f2f2f2'};
    font-weight: ${props => props.selected ? 'bold' : 'normal'};

    &:hover {
        background-color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)``
