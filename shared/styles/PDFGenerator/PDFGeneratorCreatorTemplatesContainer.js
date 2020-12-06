import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) - 15px);
    overflow: auto;
    width: 100%
`
:
styled(View)``