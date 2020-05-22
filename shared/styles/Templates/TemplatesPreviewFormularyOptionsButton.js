import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    margin: 0;
    padding: 0;
    text-align: left;
    margin-bottom: 10px;
`
:
styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
    padding: 15px 5px;
    border: ${props => props.isSelected ? '0' : '1px solid #17242D'};
    background-color: ${props => props.isSelected ? '#17242D' : 'transparent'};
    border-radius: 20px;
`