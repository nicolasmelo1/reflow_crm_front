import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #fff;
    border-radius: 5px;
    padding: 10px;
    overflow: auto;
    height: calc(var(--app-height) - 250px);
    position: relative;
`
:
styled(View)``