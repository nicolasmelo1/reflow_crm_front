import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: ${props=> props.isSelected ? '1px solid #0dbf7e' : '1px solid #bfbfbf'};
    margin-bottom: 5px;
    background-color: ${props=> props.isSelected ?'#0dbf7e50': 'transparent'};
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    color: #20253F;
    width: 100%;
`
:
styled(TouchableOpacity)``