import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    box-shadow: 0 3px 6px #17242D;
    border-radius: 10px;
    padding: 10px;

    @media(max-width: 640px) {
        width: 100%;
        margin-bottom: 10px
    }

    @media(min-width: 640px) {
        width: 50%;
        display: inline-block;
    }
`
:
styled(View)``