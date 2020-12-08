import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    border: 1px solid #17242D;
    border-radius: 5px;
    margin: 5px 0;
    
    &:focus {
        border: 1px solid #0dbf7e;
        outline: none;
    }
`
:
styled(TextInput)``