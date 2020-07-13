import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    @media(max-width: 640px) {
        display: flex;
        flex-direction: column-reverse
    }
`
:
styled(ScrollView)`
`