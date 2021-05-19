import React from 'react'
import styled from 'styled-components'
import { View, Text, ActivityIndicator } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import dynamicImport from '../../../utils/dynamicImport'

const Spinner = dynamicImport('react-bootstrap', 'Spinner')

// ------------------------------------------------------------------------------------------
export const ListingScrollWrapper = process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    overflow-y: hidden;
    overflow-x: scroll;
    height: 10px;

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
export const ListingTableContainer = process.env['APP'] === 'web' ?
styled.div`
    text-align: center;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    
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

    @media(max-width: 420px) {
        max-height: calc(var(--app-height) - var(--app-navbar-height) - ${props=> props.isMobile ? '210px' : '230px'});
    }
    @media(min-width: 420px) {
        max-height: calc(var(--app-height) - var(--app-navbar-height) - ${props=> props.isMobile ? '130px' : '150px'})
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingTableLoaderContainer = process.env['APP'] === 'web' ?
styled.div`
    position: sticky;
    left: 0;
    top: 0;
    box-sizing : border-box;
    height: 50px;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingEditButtonIcon = styled(FontAwesomeIcon)`
    width: 15px;
    color: #0dbf7e;
    cursor: pointer;
`
// ------------------------------------------------------------------------------------------
export const ListingDeleteButtonIcon = styled(FontAwesomeIcon)`
    width: 15px;
    color: red;
    cursor: pointer;
`
// ------------------------------------------------------------------------------------------
export const ListingTableContentElement = process.env['APP'] === 'web' ?  
styled.td`
    text-align: ${props=> props.isTableButton ? 'center': ' left'} !important;
    ${props=> props.isTableButton ? '': 'cursor: pointer;'}
    max-height: 20px;
    overflow: hidden;
    max-width: 50px;
    color: #6a7074;
    font-size: 15px;
    border: 1px solid #f2f2f2 !important;
    text-overflow: ellipsis; 
    white-space: nowrap
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingTableContentPopoverElement = process.env['APP'] === 'web' ?
styled.p`
    ${props=> props.hasBorderBottom ? 'border-bottom: 1px solid #bfbfbf;' : ''}
    padding: 0;
    margin: 5px
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const ListingTableHeaderContainer = process.env['APP'] === 'web' ? 
styled.th`
    padding: 0 !important;
    position: sticky;
    top: 0
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingTableHeaderElement = process.env['APP'] === 'web' ?
styled.div`
    color: ${props=> props.isTableButton ? '#0dbf7e': '#f2f2f2'} !important;
    border: 1px solid #fff;
    border-radius: ${props => props.isFirstColumn ? '10px 0 0 0' : props.isLastColumn ? '0 10px 0 0' : '0'};
    height: ${props=> props.isTableButton ? '': '100%'};
    background-color: #17242D;
    text-align: ${props=> props.isTableButton ? 'center': 'left'};
    position: relative;
    user-select: none;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingTableHeaderElementDragger = process.env['APP'] === 'web' ?
styled.div`
    cursor: col-resize;
    height: 100%;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    width: 2px;

    &:hover {
        background-color: #0dbf7e
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingTableHeaderElementParagraph = process.env['APP'] === 'web' ?
styled.p`
    margin: 10px 10px 0 10px;
    white-space: nowrap
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const ListingTableHeaderElementIconContainer = process.env['APP'] === 'web' ?
styled.div`
    margin: auto;
    text-align: center;
    margin: 0 10px 5px 10px;
    ${props=> props.isTableButton ? '': 'cursor: pointer;'};
    height: 20px
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const ListingTableHeaderElementIconSpinner =  process.env['APP'] === 'web' ?
styled(Spinner)`
    color: #0dbf7e;
`
:
styled(ActivityIndicator)``
// ------------------------------------------------------------------------------------------
export const ListingTableHeaderConditionalPopoverTextTitle = process.env['APP'] === 'web' ?
styled.p`
    color: #17242D;
    font-weight: bold;
    margin-bottom: 5px
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const ListingTableHeaderConditionalPopoverTextVariable = process.env['APP'] === 'web' ?
styled.small`
    color: #0dbf7e;
`
:
styled(Text)``