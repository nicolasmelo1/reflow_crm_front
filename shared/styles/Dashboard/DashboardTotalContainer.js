import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    overflow: auto;
    white-space: nowrap;
    border-bottom: 1px solid #bfbfbf;
    border-top: 1px solid #bfbfbf;
    padding: 10px;
`
:
styled(View)`
    border-bottom-width: 1px;
    border-top-width: 1px;
    border-bottom-color: #bfbfbf;
    border-top-color: #bfbfbf;
`