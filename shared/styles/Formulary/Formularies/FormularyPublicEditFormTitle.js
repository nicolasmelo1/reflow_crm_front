import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    font-weight: bold;
    font-size: 20px;
    margin: ${props => props.isNotPublicMessageTitle ? '0 0 75px 0': '0 0 10px 0'};
    color: ${props => props.isNotPublicMessageTitle ? 'red': '#20253F'}
`
:
styled(View)``