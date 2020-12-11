import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) - 100px);
    padding: 70px;
    width: 735px;
    background-color: #fff;
    margin: auto;
    overflow: auto;
`
:
styled(View)``