import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div` 
    width: 100%;
    height: 100%; 
    position: absolute;
    background-color: #00000020;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1
`
:
styled(View)``