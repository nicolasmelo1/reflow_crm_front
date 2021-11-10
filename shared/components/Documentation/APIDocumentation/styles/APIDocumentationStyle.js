import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, View } from 'react-native'


const possibleColors = [
    '#B1DDF1',
    '#9F87AF',
    '#88527F',
    '#7785AC', 
    '#FFC2B4', 
    '#0DBF7E', 
    '#17242D',
    '#F08700',
    '#CBA328',
    '#EF767A',
    '#8797AF',
    '#F49F0A',
    '#646536', 
    '#82204A', 
    '#FFE0B5',
    '#8B687F',
    '#D81159'
]

export const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * possibleColors.length)
    return possibleColors[randomIndex]
}

export const APIDocumentationContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    background-color: #fff;
    width: 100%;
    margin-left: -20px;
    margin-right: -20px
`
:
styled(View)``


export const APIDocumentationNavigationSidebar = process.env['APP'] === 'web' ?
styled.nav`
    display: flex;
    flex-direction: column;
    background-color: #fff;
    margin: 0 10px;
    border-radius: 5px;
    padding: 10px !important;
    box-shadow: 4px 4px 12px rgba(56, 66, 95, 0.08);
    height: 100%;
    min-width: 100px;
    max-width: calc(var(--app-width)/4);
    padding: 10px 0;
    overflow-y: auto;
`
:
styled(View)``

export const APIDocumentationNavigationButton = process.env['APP'] === 'web' ?
styled.button`
    padding: 10px;
    border: 0;
    background-color: #0dbf7e;
    border-radius: 5px;
    text-align: left;
    margin-bottom: 5px;
`
:
styled(TouchableOpacity)``

export const APIDocumentationTemplatesLabel = process.env['APP'] === 'web' ?
styled.label`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top: 2px solid #e6e6e6;
    border-bottom: 2px solid #e6e6e6;
    margin-bottom: 5px;
    color: #0dbf7e
`
:
styled(Text)``

export const APIDocumentationSubmenuNavigationButton = process.env['APP'] === 'web' ?
styled.button`
    padding: 5px;
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    text-align: left;
    margin-bottom: 0;
`
:
styled(TouchableOpacity)``

export const APIDocumentationSubSubmenuNavigationContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
`
:
styled(View)``

export const APIDocumentationHeader = process.env['APP'] === 'web' ? 
styled.h1`
    font-weight: bold;
    color: #17242D;
    margin-bottom: 10px
`
:
styled(Text)``

export const APIDocumentationSection = process.env['APP'] === 'web' ? 
styled.section`
    border-bottom: 1px solid #bfbfbf;
    padding: 20px 0;
`
:
styled(View)``

export const APIDocumentationSectionAndFieldsTableHeaderRow = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    border-bottom: 1px solid #bfbfbf;
    margin-bottom: 10px
`
:
styled(View)``

export const APIDocumentationSectionAndFieldsTableRow = process.env['APP'] === 'web' ? 
styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`
:
styled(View)``

export const APIDocumentationSectionAndFieldsTableRowCell = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100% / 3);
    height: 100%;
    padding: 0;
`
:
styled(View)``


export const APIDocumentationSectionAndFieldsTableHeaderText = process.env['APP'] === 'web' ?
styled.p`
    font-weight: bold;
`
:
styled(Text)``

export const APIDocumentationSectionsContainer = process.env['APP'] === 'web' ?
styled.div`
    overflow: auto;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 4px 4px 12px rgba(56, 66, 95, 0.08);
    wodth: 100%;
`
:
styled(View)``

export const APIDocumentationReflowVariableText = process.env['APP'] === 'web' ?
styled.span`
    color: #0dbf7e;
    font-weight: bold
`
:
styled(Text)``

export const APIDocumentationCompanyIdVaraible = process.env['APP'] === 'web' ?
styled.span`
    color: #0dbf7e;
    font-weight: bold
`
:
styled(Text)``

export const APIDocumentationAccessKeyVaraible = process.env['APP'] === 'web' ?
styled.span`
    color: #17242D;
    font-weight: bold
`
:
styled(Text)``

export const APIDocumentationStatusCodeText = process.env['APP'] === 'web' ?
styled.span`
    color: red;
    border-radius: 5px;
    padding: 2px;
    background-color: #f2f2f2
`
:
styled(Text)``

export const APIDocumentationStatusBoldText = process.env['APP'] === 'web' ?
styled.span`
    font-weight: bold
`
:
styled(Text)``

export const APIDocumentationStatusItalicText = process.env['APP'] === 'web' ?
styled.span`
    font-style: italic
`
:
styled(Text)``

export const APIDocumentationStatusVariableText = process.env['APP'] === 'web' ?
styled.span`
    color: ${props => props.color};
    font-weight: bold;
`
:
styled(Text)``

export const APIDocumentationRenewAccessKeyButton = process.env['APP'] === 'web' ?
styled.button`
    color: #0dbf7e;
    border: 0;
    background-color: transparent;

    &:hover {
        color: #bfbfbf;
    }
`
:
styled(TouchableOpacity)``

export const APIDocumentationImportatInformationLabel = process.env['APP'] === 'web' ?
styled.span`
    font-weight: bold;
`
:
styled(Text)``

export const APIDocumentationCodeContainer = process.env['APP'] === 'web' ?
styled.div`
    padding: 5px;
    border-radius: 10px;
    background-color: rgb(23, 36, 45);
    width: 100%;
` 
:
styled(View)``

export const APIDocumentationSectionAndFieldsContainer = process.env['APP'] === 'web' ?
styled.div`
    background-color: #f2f2f2;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px
`
:
styled(View)``

export const APIDocumentationFieldsContainer = process.env['APP'] === 'web' ?
styled.div`
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 10px
`
:
styled(View)``