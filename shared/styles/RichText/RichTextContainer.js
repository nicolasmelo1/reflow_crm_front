import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: ${props => props.height ? props.height : 'var(--app-height)'};
    width: 100%;
    overflow: auto;
    position: relative;
    background-color: #fff;
`
:
styled(View)``