import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: #000; 
    background-color: ${props => props.markerColor && !['', null, undefined].includes(props.markerColor) ? props.markerColor : 'transparent'}; 
    border: 1px solid #bfbfbf;
    border-radius: 5px;
    width: 30px;
    height: 30px;
`
:
styled(TouchableOpacity)`
    justify-content: center;
    align-items: center;
    border: none;
    border-radius: 2px;
    background-color: ${props => props.markerColor && !['', null, undefined].includes(props.markerColor) ? props.markerColor : 'transparent'}; 
    padding: 0 5px;
    width: 40px;
    text-align: center;
    height: 40px;
    border-radius: 5px;
    border-width: 1px;
    border-color: #17242D;
`