import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    height: 100px;
    z-index: 5;
`
:
styled(View)``