import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`

    @media(max-width: 900px) {
        overflow-y: scroll;
        max-height: calc(var(--app-height) - 60px)
    }
    @media(min-width: 900px) {
        display: flex;
        flex-direction: row;
    }
`
:
styled(ScrollView)`
    padding: 0 10px;
`