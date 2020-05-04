import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    border: 1px solid #17242D;
    border-radius: 5px;
    margin-bottom: 10px; 
    padding: 5px;
    cursor: pointer;
    background-color: ${props => props.hasRead ? 'transparent': '#f2f2f2'}
`
:
styled(TouchableOpacity)`
    padding: 10px;
    border-bottom-width: 1px;
    border-bottom-color: #17242D;
    min-height: 50px;
    background-color: ${props => props.hasRead ? 'transparent': '#f2f2f2'}
`