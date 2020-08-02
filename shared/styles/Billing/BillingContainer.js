import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow-y: auto;
    height: calc(var(--app-height) - 140px)
`
:
styled(View)``