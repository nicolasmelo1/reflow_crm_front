import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
`
:
styled(View)``