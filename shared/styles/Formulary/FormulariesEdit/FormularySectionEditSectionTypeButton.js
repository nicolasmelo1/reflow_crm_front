import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    box-shadow: 2px 2px 1px #0ba26b, -2px -2px 1px #0fdc91;
    border-radius: 4px;
    text-align: center;
    margin: 5px;
    cursor: pointer
`
:
styled(View)``