import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, View, Text } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'


export const SpreadsheetUploaderContainer = process.env['APP'] === 'web' ? styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px;
    background-color: transparent;
    width: calc(var(--app-width) - 150px);
` 
:
styled(View)`` 

export const SpreadsheetUploaderFormularySelectionContainer = process.env['APP'] === 'web' ? styled.div`
    display: flex;
    flex-direction: row;
    overflow: auto;

    scrollbar-color: #bfbfbf #fff;
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


export const SpreadsheetUploaderFormularySelectionButton = process.env['APP'] === 'web' ? styled.button`
    background: ${props => props.isSelected ? '#0dbf7e50' : '#f2f2f2'};
    padding: 10px;
    border-bottom: 1px solid #fff;
    border-right: 1px solid #fff;
    border-left: 0;
    border-top: 0;
    border-radius: 10px 10px 0 0;
    transition: background 0.2s ease-in-out, font-weight 0.2s ease-in-out;
    font-weight: ${props => props.isSelected ? 'bold' : 'normal'};

    &:hover {
        background: ${props => props.isSelected ? '#0dbf7e50' : '#20253F30'};
        font-weight: bold;
    }
` 
:
styled(TouchableOpacity)`` 


export const SpreadsheetUploaderFormularySelectionButtonLabel = process.env['APP'] === 'web' ? styled.p`
    margin: 0;
    color: #20253F;
    font-size: 15px;
` 
:
styled(Text)`` 


export const SpreadsheetUploaderTableContainer = process.env['APP'] === 'web' ? styled.div`
    display: flex;
    flex-direction: column;
    max-height: calc(var(--app-height) - 300px);
    background-color: #f2f2f2;
    border-radius: 0 10px 10px 10px;
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    width: 100%;

    scrollbar-color: #bfbfbf #fff;
    scrollbar-width: thin;
    
    &::-webkit-scrollbar-thumb {
        background: #bfbfbf;
        border-radius: 5px;
    }
    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 8px;
        height: 8px;
        background-color: #fff;
    }
`
:
styled(View)``


export const SpreadsheetUploaderTableHeaderContainer = process.env['APP'] === 'web' ? styled.div`
    display: flex;
    flex-direction: row;
    position: sticky;
    top: 0;
`
:
styled(View)``


export const SpreadsheetUploaderTableHeaderWrapper = process.env['APP'] === 'web' ? styled.div`
    background-color: #fff;
`
:
styled(View)``


export const SpreadsheetUploaderTableFieldTypeButton = process.env['APP'] === 'web' ? styled.button`

`
:
styled(TouchableOpacity)``


export const SpreadsheetUploaderTableHeader = process.env['APP'] === 'web' ? styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: 16px 10px;
    background-color: #CACDD3;
    min-width: 200px;
    max-width: 200px;
    border-radius: 0;
`
:
styled(View)``

export const SpreadsheetUploaderFieldTypeDropdown = process.env['APP'] === 'web' ? styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    text-align: left;
    padding: 16px 10px;
    background-color: #0dbf7e50;
    min-width: 200px;
    max-width: 200px;
    border-right: ${props => props.isLastColumn ? '0': '1px solid #fff'};
    border-radius: ${props => props.isLastColumn ? '0 10px 0 0': '0'};
`
:
styled(View)``


export const SpreadsheetUploaderFieldTypeDropdownButton = process.env['APP'] === 'web' ? styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    border:0;
    width: 100%;
    background-color: transparent;
    border-radius: 4px;
    transition: background 0.3s ease-in-out, font-weight 0.3s ease-in-out;

    &:hover {
        font-weight: bold;
        background-color: #fff;
    }
`
:
styled(TouchableOpacity)``

export const SpreadsheetUploaderFieldTypeDropdownMenuButton = process.env['APP'] === 'web' ? styled.button`
    padding: 10px 5px;
    width: 100%;
    border: 0;
    border-radius: 4px;
    background-color: #fff;

    &:hover {
        background-color: #f2f2f2;
    }
`
:
styled(TouchableOpacity)``


export const SpreadsheetUploaderFieldTypeDropdownContainerWrapper = process.env['APP'] === 'web' ? styled.div`
    position: relative;
    height: 0;
    left: 0;
    right: 0;
`
:
styled(View)``


export const SpreadsheetUploaderFieldTypeDropdownContainer = process.env['APP'] === 'web' ? styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 4px 4px 12px rgb(56 66 95 / 8%);
    margin-top: 1px
`
:
styled(View)``


export const SpreadsheetUploaderTableHeaderLabel = process.env['APP'] === 'web' ? styled.p`
    color: #20253F;
    margin: 0;
    font-weight: bold;
    font-size: 15px;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 20px;
`
:
styled(Text)``


export const SpreadsheetUploaderTableHeaderTrashIconButton = process.env['APP'] === 'web' ? styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 0;
    background: rgba(255, 0, 0, 0.0);
    transition: background 0.3s ease-in-out;

    &:hover {
        background: rgba(255, 0, 0, 0.2);
    }
`
:
styled(TouchableOpacity)``


export const SpreadsheetUploaderTableHeaderTrashIcon = styled(FontAwesomeIcon)`
    color: red
`


export const SpreadsheetUploaderTableContentContainer = process.env['APP'] === 'web' ? styled.div`
    display: flex;
    flex-direction: row;
    overflow-y: visible;
`
:
styled(View)``


export const SpreadsheetUploaderTableRow = process.env['APP'] === 'web' ? styled.div`
    display: flex;
    flex-direction: column;
`
:
styled(View)``

export const SpreadsheetUploaderTableContent = process.env['APP'] === 'web' ? styled.div`
    background-color: ${props=> props.isEven ? '#F8F9F9': '#fff'};
    text-overflow: ellipsis;
    min-width: 200px;
    max-width: 200px;
    min-height: 55px;
    white-space: nowrap;
    border-right: 1px solid #fff;
    padding: 16px 10px;
`
:
styled(Text)``

export const SpreadsheetUploaderTableContentLabel = process.env['APP'] === 'web' ? styled.p`
    color: #20253F;
    font-weight: 500;
    margin: 0;
    font-size: 15px;
    text-align: left;
`
:
styled(Text)``

export const SpreadsheetUploaderTitle = process.env['APP'] === 'web' ? 
styled.h2`
    color: #20253F;
    font-size: 24px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 20px
`
:
styled(Text)``

export const SpreadsheetUploaderBottomButtonsContainer = process.env['APP'] === 'web' ? 
styled.div`
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: flex-end
`
:
styled(View)``

export const SpreadsheetUploaderBottomButton = process.env['APP'] === 'web' ? 
styled.button`
    background-color: ${props => props.disabled ? '#bfbfbf70': '#0dbf7e'};
    border-radius: 4px;
    border: 0;
    padding: 5px 10px;
    color: #fff;
    font-weight: bold;

    &:hover {
        background-color: ${props => props.disabled ? '#bfbfbf70': '#0dbf7e50'};
        color: ${props => props.disabled ? '#fff': '#20253F'};

    }
`
:
styled(TouchableOpacity)``


export const SpreadsheetUploaderClickAndDropContainer = process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) /2);
    display: flex;
    justify-content: center;
    border-radius: 5px;
    background-color: ${props => props.isDraggingOver ? '#f2f2f2': 'transparent'};
    align-items: center
`
:
styled(View)``


export const SpreadsheetUploaderClickAndDropButtonContainer = process.env['APP'] === 'web' ?
styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    user-select: none;
`
:
styled(View)``


export const SpreadsheetUploaderExampleSheetButton = process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    color: #20253F;
    font-weight: bold;
    background-color: #fff;
    border-radius: 4px;
    padding: 10px;
    width: 100%;
    box-shadow: 2px 2px 16px rgba(190, 205, 226, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1);
    font-size: 13px;

    &:hover {
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
    &:active {
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
`
:
styled(TouchableOpacity)``