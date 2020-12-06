import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow: auto;
    height: calc(var(--app-height) - 100px);
    background-color: #fff
`
:
styled(View)``