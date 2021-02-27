import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0; 
    margin: 0; 
    background-color: transparent;
    border-radius: 5px;
    ${props => props.isCollapsed ? `
        justify-content: flex-start;
        display: flex;
        padding: 30px 5px;
    ` : `
        &:hover {
            background-color: #0dbf7e50
        }
    `}    
`
:
styled(TouchableOpacity)``