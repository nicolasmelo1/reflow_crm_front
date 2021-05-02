import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, Text, Image, View } from 'react-native'

// ------------------------------------------------------------------------------------------
export const NavbarFreeTrialAlertButton = process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #0dbf7e;
    border-radius: 5px;
    color: #fff;
    background-color: #0dbf7e;
    width: 200px
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const NavbarFreeTrialAlertText = process.env['APP'] === 'web' ?
styled.small`
    ${props => props.isBold ? `font-weight: bold`: ''}
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const NavbarLogo = process.env['APP'] === 'web' ? 
styled.img`
    object-fit: cover;
    width: 110px;
`
: 
styled(Image)``
// ------------------------------------------------------------------------------------------
export const NavbarToggleButton = process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 829px) {
        float: right;
        padding: 10px;
        cursor: pointer;
    }
    @media(min-width: 830px) {
        display: none;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarItemsContainer = process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 829px) {
        position: fixed;
        bottom: 0;
        left: 0;
        diplay: flex;
        justify-content: center;
        align-items: center;
        z-index: 30;
        background-color: #fff;
        width: 100%;
        height: ${props=> props.isOpen ? 'calc(var(--app-height) - var(--app-navbar-height))': '0'};
        transition: height 0.3s ease-in-out;
    }
    @media(min-width: 830px) {
        float: right;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarContainer = process.env['APP'] === 'web' ?
styled.nav`
    padding: 13px 10px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    app-region: drag;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------