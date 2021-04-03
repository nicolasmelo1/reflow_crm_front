import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    border-radius: 5px;
    margin: 5px;
    width: 95%;
`
:
styled(TextInput)``