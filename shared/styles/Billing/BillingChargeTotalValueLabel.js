import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    margin: 0;
    width: 100%;
    font-weight: bold;
    text-align: center;
`
:
styled(View)``