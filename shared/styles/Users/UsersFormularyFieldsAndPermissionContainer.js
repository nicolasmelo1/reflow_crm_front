import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow: auto;
    height: calc(var(--app-height) - 45px )
`
:
styled(ScrollView)`
    height: 92.5%;
`