import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    font-size: 1.75rem;
    color: #0dbf7e;
    border: 0;
    background-color: transparent;
    width: 100%;
    
    &:focus {
        outline: none;
    }
`
:
styled(TextInput)``