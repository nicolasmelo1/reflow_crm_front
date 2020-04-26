import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #444;
    margin-bottom: 5px;
    padding: 10px;
`
:
styled(View)`
    background-color: #444;
    margin-bottom: 5px;
    padding: 10px;
`