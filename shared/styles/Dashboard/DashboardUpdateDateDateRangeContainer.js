import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    z-index: 10;
    width: calc(var(--app-width) - 40px);
    left: 20px
`
:
styled(View)``