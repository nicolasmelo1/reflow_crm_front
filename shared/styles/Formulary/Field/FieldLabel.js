import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.label`
    display: inline-block;
    margin: 0;
    color: ${props => props.isConditional ? '#f2f2f2': '#17242D'};
    font-weight: 600;
`
:
styled(Text)``