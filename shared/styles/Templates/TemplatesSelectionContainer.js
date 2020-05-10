import React from 'react'
import styled from 'styled-components'
import { FlatList } from 'react-native'

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
styled(FlatList)`
    height: 85%;
    width: 100%;
    padding: 10px;
`