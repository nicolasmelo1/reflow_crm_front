import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    height: calc(100vh - 150px);
    overflow-y: auto;
`
:
styled(ScrollView)`
    min-height: 250px;
    height: 93.4%;
`