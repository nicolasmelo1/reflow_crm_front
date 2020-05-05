import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: ${props => props.isSelected ? '#0dbf7e': 'transparent'};
    padding: 10px 15px;
    display: block;
    border: 0;
    border-radius: 20px;
    margin: 10px 0;
    cursor: pointer;
`
:
styled(TouchableOpacity)