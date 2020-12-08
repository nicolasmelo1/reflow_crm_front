import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    padding-bottom: 5px;
    border-bottom: 1px solid #bfbfbf;
`
:
styled(View)``