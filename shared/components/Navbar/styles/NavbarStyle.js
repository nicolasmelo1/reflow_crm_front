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
    
    @media(min-width: 420px) {
        margin-left: ${props=> props.showSideBar ? '75px': '0'};
    }
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
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: #fff;
        width: 100%;
        opacity: ${props => props.isOpen ? '1': '0'};
        height: ${props=> props.isOpen ? 'calc(var(--app-height))': '0'};
        transition: height 0.2s ease-in-out, opacity 0.2s ease-in-out;
    }
    @media(min-width: 830px) {
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarItemsContainerHeader = process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 829px) {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
    }

    @media(min-width: 830px) {
        display: none;
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarContainer = process.env['APP'] === 'web' ?
styled.nav`
    @media(max-width: 829px) {
        z-index: ${props => props.isOpen ? '20': '1'};
        transition: z-index 0.2s ease-in-out;
    }

    @media(min-width: 830px) {
        z-index: 1;
    }

    @media(max-width: 419px) {
        padding: 10px 10px 5px 10px;
    }

    @media(min-width: 420px) {
        padding: 13px 10px;
    }

    width: var(--app-width);
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    app-region: drag;
    box-shadow: 2px 2px 8px rgba(190, 205, 226, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1);
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarUserImageButton = process.env['APP'] === 'web' ?
styled.div`
    @media(min-width: 830px) {
        position: relative;
        float: left;
    }

    cursor: pointer;
    border: 0;
    border-radius: 50%;
    background-color: transparent;
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const NavbarUserImageWrapper = process.env['APP'] === 'web' ?
styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: transparent;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border: 1px solid #bfbfbf;
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarUserDropdownContainer = process.env['APP'] === 'web' ?
styled.div`
    margin-top: 5px;
    display: flex;
    flex-direction: column;

    @media(min-width: 830px) {
        box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 20%);
        margin-left: 5px;
        margin-right: 5px;
        position: absolute;
        right: 0px;
        min-width: 140px;
        background-color: #fff; 
        border-radius: 5px
    }
`
:
styled(View)``
// ------------------------------------------------------------------------------------------
export const NavbarUserDropdownButton = process.env['APP'] === 'web' ?
styled.button`
    padding: 5px;
    text-decoration: none;
    user-select: none;
    background-color: transparent;
    color: #20253F;
    border: 0;
    font-size: 13px;
    padding: 5px;
    ${props => props.hasBorderAtBottom === false ? '' : 'border-bottom: 1px solid #f2f2f2;'}

    &:hover {
        color: ${props => props.isLogout ? 'red' : '#0dbf7e'};
    }
`
:
styled(TouchableOpacity)``