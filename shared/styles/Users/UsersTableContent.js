import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.td`
    background-color: #fff;
    color: #6a7074;
    padding: 10px;
`
:
styled(View)``