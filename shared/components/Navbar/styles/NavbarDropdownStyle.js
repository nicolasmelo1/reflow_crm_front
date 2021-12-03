import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, Text, Image, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// ------------------------------------------------------------------------------------------
export const NavbarDropdownContentContainer = process.env['APP'] === 'web' ? 
styled.div`
    float: none;
    margin-top: 5px;

    @media(max-width: 829px) {
        display: block;
        text-align: center;
        width: 100%;
    }
    @media(min-width: 830px) {
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid #f2f2f2;
        box-shadow: 0px 4px 5px 0px rgba(0,0,0,0.2);
        margin-left: 5px;
        margin-right: 5px; 
        width: 90% !important;
        z-index: 1;
        position: absolute;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarDropdownContainer = process.env['APP'] === 'web' ? 
styled.div`
    padding: 10px;
    position: relative;
    @media(max-width: 829px) {
        display: block;
        text-align: center;
    }
    @media(min-width: 830px) {
        float: left;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarDropdownItem = process.env['APP'] === 'web' ? 
styled.a`
    display: block;
    text-decoration: none;
    color: #20253F;
    padding: 5px;
    font-size: 13px;

    &:hover {
        text-decoration: none;
        color: #0dbf7e
    }

    @media(max-width: 829px) {
        display: block;
        width: 100%;
        text-align: center;
        background-color: #f2f2f2;
        border-bottom: 1px solid #fff;
        &:first-child {
            border-top: 1px solid #fff;
        }
    }
    @media(min-width: 830px) {
        border-bottom: 1px solid #f2f2f2;
        float: none;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const NavbarDropdownButton = process.env['APP'] === 'web' ?
styled.a`
    color: ${props=> props.isOpen ? '#0dbf7e' : '#20253F'} !important;
    &:hover {
        color: #0dbf7e !important;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const NavbarDropdownArrowIcon = styled(FontAwesomeIcon)`
    margin: 0 0 0 10px;
`
