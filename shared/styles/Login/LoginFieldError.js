import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.small`
    color: red;
    min-height: 20px;
    align-self: flex-start;
    margin-bottom: 5px;
`
:
styled(Text)`
    min-height: 30px;
    align-self: flex-start;
    color: red;
`