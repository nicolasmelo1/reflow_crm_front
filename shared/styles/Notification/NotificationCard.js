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
    border: 1px solid #17242D;
    border-radius: 5px;
    margin-bottom: 10px; 
    padding: 5px;
    background-color: ${props => props.hasRead ? 'transparent': '#f2f2f2'}
`