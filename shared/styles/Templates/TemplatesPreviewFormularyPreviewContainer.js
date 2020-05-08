import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    min-width: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;

    @media(max-width: 900px) {
        margin: 10px 0;
    }

    @media(min-width: 900px) {
        margin: 0 20px;
    }
`
:
styled(View)``