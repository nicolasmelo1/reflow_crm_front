import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h4`
    margin: 0 0 0 10px;
    font-weight: 100
`
:
styled(Text)`
    margin: 0 0 0 10px;
    font-weight: 300;
    font-size: 20px;
    color: ${props => props.isSelected ? '#0dbf7e' : '#6a7074'};
`