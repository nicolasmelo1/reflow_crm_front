import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 20px;
    background-color: #f2f2f2;
    width: 2px
`
:
styled(View)``