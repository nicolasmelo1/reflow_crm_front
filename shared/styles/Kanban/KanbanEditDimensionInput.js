import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    border: 1px solid #0dbf7e;
    border-radius: 5px;
    display: flex;
    justify-content: space-between
`
:
styled(TextInput)``