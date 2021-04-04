import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0dbf7e
`
:
styled(View)``