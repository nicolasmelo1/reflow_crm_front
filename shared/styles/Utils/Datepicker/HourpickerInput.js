import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    width: 100%;
    caret-color: #f2f2f2;
    color: #f2f2f2;
    outline: none;
    background-color: transparent;
    border: 0;
    text-align: center
`
:
styled(TextInput)``