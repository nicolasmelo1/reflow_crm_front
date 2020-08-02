import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 0 15px;
    @media(min-width: 640px) {
        width: 50%;
    }
    @media(max-width: 640px) {
        width: 100%;
    }
`
:
styled(View)``