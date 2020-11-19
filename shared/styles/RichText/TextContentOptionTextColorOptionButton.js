import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    color: ${props => props.textColor && !['', null, undefined].includes(props.textColor) ? props.textColor : '#000'};
    background-color: transparent; 
    padding: 3px 10px;
    border-radius: 5px; 
    margin: 3px
`
:
styled(TouchableOpacity)``