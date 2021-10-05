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
    background-color: #bfbfbf;
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
    text-align: left;
    margin-bottom: 5px;
`
:
styled(TouchableOpacity)``

export const APIDocumentationSectionAndFieldsTableRowCell = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    width: calc(100% / 3);
    height: 100%;
    padding: 0;
`
:
styled(View)``