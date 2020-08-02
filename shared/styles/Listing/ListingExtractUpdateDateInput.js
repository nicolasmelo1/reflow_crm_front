import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    color: #0dbf7e;
    background-color: transparent;
    border: 0;
    display: inline-block;
    cursor: pointer;

    &:focus {
        outline: none;
    }
`
:
styled(Text)``