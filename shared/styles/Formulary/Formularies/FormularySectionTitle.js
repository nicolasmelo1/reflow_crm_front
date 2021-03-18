import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    color: ${props => props.isConditional ? '#f2f2f2' : '#17242D'}; 
    font-weight: normal;
    letter-spacing: 0.5px;
    text-shadow: -1px -1px 0 #17242D, 1px -1px 0 #17242D, -1px 1px 0 #17242D, 1px 1px 0 #17242D;
    border-bottom: 1px solid #f2f2f2;
`
:
styled(Text)``
