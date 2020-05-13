import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    padding: 0 10px;
    overflow: auto;

    @media(max-width: 492px) {
        flex-direction: column;
    }

    @media(min-width: 492px) {
        flex-direction: row;
    }
`
:
styled(View)``