import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow-x: auto;
    white-space: nowrap;
    max-width: calc(var(--app-width) - 20px);
`
:
styled(ScrollView)`
`