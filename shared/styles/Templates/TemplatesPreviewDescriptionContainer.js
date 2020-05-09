import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    flex-direction: column;
    display: flex;
    width: 100%;
    min-width: 300px;

    @media(max-width: 900px) {
        margin: 10px 0;
        height: 100%;
    }

    @media(min-width: 900px) {
        margin: 0 20px;
    }
`
:
styled(View)``