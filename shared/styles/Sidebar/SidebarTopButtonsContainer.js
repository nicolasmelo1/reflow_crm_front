import React from 'react'
import styled from 'styled-components'
import { ScrollView } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div``
:
styled(ScrollView)`
    flex-direction: row;
    flex-wrap: nowrap;
    align-content:flex-start;
`