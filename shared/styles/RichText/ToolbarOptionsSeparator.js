import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    margin: 0 10px;
    height: 20px;
    width: 2px;
    background-color: #f2f2f2
`
:
styled(View)`
    margin-left: 10px,
    margin-right: 10px,
    margin-top: 0,
    margin-bottom: 0,
    height: 40px,
    width: 2px,
    background-color: #f2f2f2
`
