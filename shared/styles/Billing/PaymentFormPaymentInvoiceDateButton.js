import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 100%;
    border-radius: 20px;
    border: 0;
    padding: 5px;
    background-color: ${props => props.isSelected ? '#0dbf7e': 'transparent'};
`
:
styled(TouchableOpacity)``