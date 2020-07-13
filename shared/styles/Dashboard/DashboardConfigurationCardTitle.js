import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    color: ${props=> props.isOpen ? '#17242D' : '#0dbf7e'};
    margin: 0;
    user-select: none;
    text-align: center;
    width: 100%;
`
:
styled(Text)`
    align-self: center;
    color: ${props=> props.isOpen ? '#17242D' : '#0dbf7e'};
    font-weight: bold;
`