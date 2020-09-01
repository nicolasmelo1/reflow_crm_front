import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    margin: 0;
    padding: 0; 
    font-weight: bold
`
:
styled(Text)`
    margin-bottom: 5px;
    font-weight: bold;
`