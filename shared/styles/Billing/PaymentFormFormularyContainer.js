import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(var(--app-height) - 200px);
`
:
styled(View)``