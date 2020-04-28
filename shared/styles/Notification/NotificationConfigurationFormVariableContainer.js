import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #444;
    padding: 10px;
`
:
styled(View)`
    background-color: #444;
    padding: 10px;
`