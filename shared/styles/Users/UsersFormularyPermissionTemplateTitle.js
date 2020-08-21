import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    margin: 0 0 0 10px;
    font-weight: 900
`
:
styled(Text)`
    margin: 0 0 0 10px;
    font-weight: 900;
    font-size: 25px;
    color: ${props => props.isSelected ? '#0dbf7e' : '#6a7074'};
`