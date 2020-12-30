import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent; 
    padding: 3px 10px;
    color: ${props => props.textColor ? props.textColor : '#000'};
    border-radius: 5px; 
    margin: 3px;
    width: 30px;
    height: 30px;
`
:
styled(TouchableOpacity)`
    padding: 10px 10px;
    border-bottom-width: 1px;
    border-bottom-color: #bfbfbf;

`