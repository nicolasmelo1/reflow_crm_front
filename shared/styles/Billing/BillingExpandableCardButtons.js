import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border-top: 1px solid ${props => props.errors ? 'red' : '#20253F'};
    border-right: 1px solid ${props => props.errors ? 'red' : '#20253F'};
    border-left: 1px solid ${props => props.errors ? 'red' : '#20253F'};
    border-bottom: 4px solid ${props => props.errors ? 'red' : '#20253F'};
    background-color: #fff;
    width: 100%;
    border-radius: 5px
`
:
styled(TouchableOpacity)``