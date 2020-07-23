import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 100%;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
    transition: height 0.3s ease-in-out;
    width: 100%;
`
:
styled(View)``