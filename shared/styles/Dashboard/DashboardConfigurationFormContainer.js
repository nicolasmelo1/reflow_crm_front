import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    margin-left: 10px;
    margin-right: 10px;
    background-color: #fff;
`
:
styled(View)``