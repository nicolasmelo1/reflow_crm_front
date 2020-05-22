import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: ${props => props.isSelected ? '0 0 0 10px': '0'};
    font-weight: bold;
    color: #17242D;
    display: inline;
    transition: margin .5s ease-in-out
`
:
styled(Text)`
    color: ${props => props.isSelected ? '#f2f2f2' : '#17242D'};
`