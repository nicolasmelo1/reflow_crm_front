import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.textarea`
    border: 0;
    background-color: white !important;
    color: #17242D;
    border: 1px solid #0dbf7e;

    &:focus {
        color: #17242D;
        background-color: white;
        border: 1px solid #17242D;
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)``