import React from 'react'
import styled from 'styled-components'
import { Text, TouchableOpacity, View } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

// ------------------------------------------------------------------------------------------
export const NavbarLinkIcon = styled(FontAwesomeIcon)``
// ------------------------------------------------------------------------------------------
export const NavbarLinkLabel = process.env['APP'] === 'web' ? 
styled.p`
    font-weight: 400;
    display: inline-block;
    margin:0;
    user-select: none;
`
:
styled(Text)``
// ------------------------------------------------------------------------------------------
export const NavbarLinkAnchor = process.env['APP'] === 'web' ? 
styled.a`
    padding: 10px;
    color: #17242D;
    &:hover {
        color: #0dbf7e;
    }

    @media(max-width: 829px) {
        display: block;
        text-align: center;
    }
    @media(min-width: 830px) {
        float: left;
    }
`
:
styled(TouchableOpacity)``
// ------------------------------------------------------------------------------------------
export const NavbarLinkIconContainer = process.env['APP'] === 'web' ? 
styled.div`
    display: inline-block;
    margin-right: 8px;
    ${props=> props.badge ? `
        &:after {
            background-color: #0dbf7e;
            border-radius: 30px;
            color: #fff;
            content: "${props.badge}";
            font-weight: bold;
            font-size: 11px;
            margin-top: -10px;
            margin-left: -10px;
            min-width: 20px;
            padding: 2px;
            position: absolute;
            text-align: center;
        }
    ` : ''}
`
:
styled(View)``
// ------------------------------------------------------------------------------------------