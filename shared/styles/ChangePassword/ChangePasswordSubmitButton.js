import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 150px;
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border-radius: 20px;
    border: 0;
    padding: 5px;
`
:
styled(TouchableOpacity)`
    background-color: ${props => props.disabled ? '#f2f2f2' : '#0dbf7e'};
    border-radius: 20px;
    padding: 10px 30px;
`