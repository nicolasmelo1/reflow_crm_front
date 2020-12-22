import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: ${props => props.textColor && !['', null, undefined].includes(props.textColor) ? props.textColor : '#000'}; 
    border: 0;
    background-color: transparent; 
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
    padding: 0 5px;
    width: 40px;
    text-align: center;
    height: 40px;
`