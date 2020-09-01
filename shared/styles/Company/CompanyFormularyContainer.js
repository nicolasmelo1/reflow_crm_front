import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px
`
:
styled(View)`
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
    padding: 10px 0
`