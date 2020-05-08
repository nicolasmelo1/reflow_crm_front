import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;

    @media(max-width: 900px) {
        flex-direction: column;
        overflow-y: auto;
        max-height: calc(var(--app-height) - 40px)
    }
    @media(min-width: 900px) {
        flex-direction: row;
    }
`
:
styled(View)``