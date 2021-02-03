import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    margin: 10px;
    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-bottom: ${props => props.isSelected ? `1px solid #0dbf7e`: `1px solid transparent`};
    color: ${props => props.isSelected ? `#0dbf7e`: `#f2f2f2`};
`
:
styled(TouchableOpacity)`
    padding: 10px 15px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.isSelected ? `#0dbf7e`: `transparent`};
`