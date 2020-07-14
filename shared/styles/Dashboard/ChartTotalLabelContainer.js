import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 0;
    ${props => props.hasBorderBottom ? 'border-bottom: 1px solid #17242D;' : ''}
`
:
styled(View)`
    padding: 0;
    border-bottom-width: .3px;
    border-bottom-color: #bfbfbf;
`