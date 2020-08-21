import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border-top: 1px solid ${props => props.errors ? 'red' : '#17242D'};
    border-right: 1px solid ${props => props.errors ? 'red' : '#17242D'};
    border-left: 1px solid ${props => props.errors ? 'red' : '#17242D'};
    border-bottom: 4px solid ${props => props.errors ? 'red' : '#17242D'};
    background-color: #fff;
    width: 100%;
    border-radius: 5px
`
:
styled(TouchableOpacity)``