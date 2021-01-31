import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    height: calc(var(--app-height) - 50px);
    overflow: auto;
`
:
styled(ScrollView)`
    background-color: #f2f2f2;
    height: 100%;
    flex-direction: column;
`