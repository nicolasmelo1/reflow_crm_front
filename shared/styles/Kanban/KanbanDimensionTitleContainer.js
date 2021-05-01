import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    justify-content: space-between;
    margin: 10px;
    font-weight: bold;

    ${props => props.isCollapsed ? `
        cursor: pointer;
        border-radius: 20px;
        background-color: #f2f2f250;
        
        &:hover {
            background-color: #f2f2f2;
        }

        @media(min-width: 641px) {
            height: calc(var(--app-height) - var(--app-navbar-height) - 200px);
        }

        @media(max-width: 640px) {
            height: calc(var(--app-height) - var(--app-navbar-height) - 240px);
        }
    ` : ''}
`
:
styled(View)``