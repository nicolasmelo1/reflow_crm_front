import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: ${props => props.isTitle ? '0 0 10px 0' : '0'};
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    word-wrap: break-word;
    font-size: ${props => props.isTitle ? '17px' : '15px'};
    color: ${props => props.isTitle ? '#0dbf7e' : '#6a7074'};
    font-weight: ${props => props.isTitle ? 'bold': 'normal'};
    padding: 0 5px;

    &:hover {
        background-color: #f2f2f2;
        border-radius: 5px;
    }
`
:
styled(Text)``