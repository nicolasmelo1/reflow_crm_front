import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    display: block;
    font-weight: bold;
    margin: 0 0 5px 0;
    align-self: flex-start;

    &:not(:first-child) {
        margin-top: 10px
    }
`
:
styled(Text)`
    font-weight: bold;
    margin: 10px 0 5px 0;
    align-self: flex-start;
`