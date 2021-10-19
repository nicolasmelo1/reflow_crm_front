import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, View } from 'react-native'

export const APIDocumentationContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    background-color: #fff;
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
    padding: 10px 0;
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

export const APIDocumentationHeader = process.env['APP'] === 'web' ? 
styled.h1`
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