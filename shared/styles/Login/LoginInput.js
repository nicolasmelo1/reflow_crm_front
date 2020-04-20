import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input``
:
styled(TextInput)`
    width: 100%;
    padding: 5px;
    border: 1px solid #444;
    border-radius: 5px;
`