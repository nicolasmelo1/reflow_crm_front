import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) - 52px);
    padding: 20px;
    width: 764px;
    background-color: #fff;
    margin: auto;
    overflow: auto;
`
:
styled(View)``