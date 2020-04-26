import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    margin: 0;
    color: ${props => props.formIsOpen ? '#444' : '#0dbf7e'};
    user-select: none;
`
:
styled(Text)`
    margin: 0;
    font-size: 20px;
    color: ${props => props.formIsOpen ? '#444' : '#0dbf7e'};
`