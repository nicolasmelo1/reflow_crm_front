import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    white-space: nowrap
`
:
styled(View)`
    width: 100%;
    height: 50px;
    background-color: #fff;
    align-self: flex-end;
`