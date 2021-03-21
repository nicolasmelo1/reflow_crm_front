import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border-radius: 10px;
    padding: ${props => props.fieldIsHidden && props.labelIsHidden ? '0' : '5px'};
    ${props => props.invalid ? 'border: 1px solid red;': ''}
`
:
styled(View)``