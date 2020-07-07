import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    overflow: auto;
    white-space: nowrap;
    border-bottom: 2px solid #17242D;
    border-top: 2px solid #17242D;
    padding: 10px;
`
:
styled(View)``