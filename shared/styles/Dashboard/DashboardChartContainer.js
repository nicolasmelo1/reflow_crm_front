import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding-bottom: 20px;
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 50px
    }

    &:not(:last-child) {
        border-bottom: 2px solid #17242D
    }
`
:
styled(View)``