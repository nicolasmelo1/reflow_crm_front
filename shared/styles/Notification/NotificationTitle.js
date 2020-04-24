import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.h2`
    color: #0dbf7e;
    border-bottom: 1px solid #bfbfbf;
` 
:
styled(Text)`
    color: #0dbf7e;
    font-size: 24px;
    margin-bottom: 5px;
`