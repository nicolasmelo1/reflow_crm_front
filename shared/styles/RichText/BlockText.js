import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: inline-block;
    white-space: pre-wrap;
    word-break: break-word;
    width: 100%;
    padding: 5px;
    outline: none !important;
`
:
styled(View)``