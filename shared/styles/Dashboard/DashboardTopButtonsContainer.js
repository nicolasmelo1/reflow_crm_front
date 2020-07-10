import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;

    @media(min-width: 640px) {
        flex-direction: row;
        justify-content: space-between;
    }

    @media(max-width: 640px) {
        flex-direction: column;
        flex-flow: column;
    }
`
:
styled(View)``