import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 100%;
    width: 100%;
    background-color: transparent;
`
:
styled(View)``