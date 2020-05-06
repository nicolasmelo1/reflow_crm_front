import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    color: black;
    padding: 10px;
    overflow-y: auto;

    @media(max-width: 492px) {
        max-height: calc(var(--app-height) - 207px)
    }

    @media(min-width: 492px) {
        max-height: calc(var(--app-height) - 47px)
    }
`
:
styled(View)``