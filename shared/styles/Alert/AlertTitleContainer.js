import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 10px;
    width: 100%;
    background-color: #f2f2f2;
    color: #20253F !important;
    border-radius: 5px;
    text-align: center;
`
:
styled(View)``