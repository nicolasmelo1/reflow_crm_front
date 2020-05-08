import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow-y: auto;

    @media(min-width: 900px) {
        max-height: calc(var(--app-height) - 85px);
    }
`
:
styled(View)``