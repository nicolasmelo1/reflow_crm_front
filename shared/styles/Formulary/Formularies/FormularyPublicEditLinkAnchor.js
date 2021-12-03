import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.a`
    font-weight: bold;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    color: #0dbf7e;
    margin-left: 10px;
    
    &:hover {
        color: #20253F50;
        text-decoration: underline;
    }
`
:
styled(Text)``