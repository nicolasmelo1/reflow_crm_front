import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.table`
    width: 100%;
    overflow: auto;
    max-height: calc(var(--app-height) - 120px)
`
:
styled(View)``