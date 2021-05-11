import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import dynamicImport from '../../../utils/dynamicImport'

const Dropdown = dynamicImport('react-bootstrap', 'Dropdown')

export const ListingTopToolbarContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;

    @media(min-width: 740px) {
        flex-direction: row;
    }
    @media(max-width: 740px) {
        flex-direction: column;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingFilterAndExtractContainer = process.env['APP'] === 'web' ?
styled.div`
    position: relative;
    display: inline-block;
    
    @media(min-width: 740px) {
        width: 150px;
        margin: 0 10px 0 0;
    }
    @media(max-width: 740px) {
        width: 49%;
        ${props=> props.hasLeftMargin ? 'margin: 0 0 0 1%;': 'margin: 0 1% 0 0;' }
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingFilterAndExtractButton = process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    border: 1px solid #17242D;
    width: 100%;
    padding: 5px 5px;
    text-align: center;
    color: #17242D;
    border-radius: 50px;

    &:hover {
        background-color: #0dbf7e;
        border: 1px solid #0dbf7e;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 1px solid #0dbf7e;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const ListingFilterContainer = process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    max-width: 600px;
    z-index: 10;
    background-color: #17242D;
    border-radius: 5px; 
    padding: 10px;
    box-shadow: 0 4px 20px 0 black;

    @media(max-width: 420px) {
        width: 92vw;
    };

    @media(min-width: 420px) {
        width: 82vw;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingFilterIcon = styled(FontAwesomeIcon)`
    width: 24px;
    color: #17242D;
`
// ------------------------------------------------------------------------------------------
export const ListingExtractContainer = process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    z-index: 10;
    background-color: #17242D;
    border-radius: 5px; 
    padding: 10px;
    box-shadow: 0 4px 20px 0 black;
    min-width: 237px;

    @media(max-width: 740px) {
       right:0;
       width: calc(var(--app-width) - 40px);
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingExtractUpdateDateTitle = process.env['APP'] === 'web' ?
styled.p`
    color: #f2f2f2;
    margin: 0;
    font-weight: bold
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const ListingExtractUpdateDateInput = process.env['APP'] === 'web' ?
styled.input`
    color: #0dbf7e;
    background-color: transparent;
    width: 100%;
    border: 0;
    display: inline-block;
    cursor: pointer;

    &:focus {
        outline: none;
    }
`
:
styled(TextInput)``
// ------------------------------------------------------------------------------------------
export const ListingExtractButtons = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    color: white;

    &:hover{
        border-radius: 5px;
        background-color: #fff;
        color: #17242D;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const ListingExtractUpdateDateContainer = process.env['APP'] === 'web' ?
styled.div`
    color: #0dbf7e;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingColumnSelectButton = process.env['APP'] === 'web' ? 
styled.button`
    border: 1px solid #17242D;
    background-color: #fff !important;
    margin: 0;
    padding: 5px 10px;
    color: #17242D;
    border-radius: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #0dbf7e !important;
        border: 1px solid #0dbf7e;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 1px solid #0dbf7e;
    }

    @media(max-width: 740px) {
        margin: 5px 0 0 0;
        width: 100%;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const ListingColumnSelectItemsContainer = process.env['APP'] === 'web' ? 
styled.div`
    position: absolute;
    z-index: 5;
    padding: 0 !important;
    overflow: auto;
    margin-top: 5px;
    border-radius: 5px;
    box-shadow: 0 4px 20px 0 black;

    @media(max-width: 740px) {
        height: calc(var(--app-height) - var(--app-navbar-height) - 215px);
    };

    @media(min-width: 740px) {
        max-height: calc(var(--app-height) - var(--app-navbar-height) - 175px);
    };

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
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingColumnSelectItems = process.env['APP'] === 'web' ?
styled.div`
    background-color: ${props => props.isSelected ? '#17242D' : '#f2f2f2'} !important;
    color: ${props => props.isSelected ? '#f2f2f2' : '#17242D'};
    border: 0;
    display: block;
    width: 100%;
    padding: 5px 10px;
    &:hover {
        background-color: #0dbf7e !important;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingColumnSelectContainer = process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 740px) {
        width: 100%;
    };
    @media(min-width: 740px) {
        float: right;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
