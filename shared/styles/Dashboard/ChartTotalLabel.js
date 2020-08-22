import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    font-size: ${props => props.isTotal? '15px' : '12px'};
    ${props => props.isTotal ? 'font-weight: bold;': ''}
    color: ${props => props.isTotal ? '#0dbf7e': '#707070'};

`
:
styled(Text)`
    margin: 5px 0;
    font-size: ${props => props.isTotal? '20px' : '12px'};
    ${props => props.isTotal ? 'font-weight: bold;': ''}
    color: ${props => props.isTotal ? '#0dbf7e': '#707070'};
`