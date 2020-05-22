import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 150px;
    align-self: flex-end;
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border-radius: 20px;
    border: 0;
    padding: 5px;
`
:
styled(TouchableOpacity)`
    border-radius: 20px;
    margin: 0;
    padding: 10px;
    align-items: center;
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
`