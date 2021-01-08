import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #f2f2f2;
    border-radius: 5px;
    border: 1px solid #bfbfbf;
    width: 100%;
    padding: 10px;
    text-align: left
`
:
styled(View)``