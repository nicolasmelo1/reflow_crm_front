import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) - 180px);
    padding-bottom: 50px;
    overflow: auto;
    position: relative;
    width: calc(var(--app-width) - 40px);
`
:
styled(View)``