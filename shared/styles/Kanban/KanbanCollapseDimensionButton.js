import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0; 
    margin: 0; 
    background-color: transparent;
    ${props => props.isCollapsed ? `
        justify-content: flex-start;
        display: flex;
        padding: 30px 5px;
    ` : ''}    
`
:
styled(TouchableOpacity)``