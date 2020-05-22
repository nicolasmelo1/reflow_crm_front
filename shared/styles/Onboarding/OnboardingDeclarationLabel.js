import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.label`
    margin-bottom: 20px;
    margin-top: 15px;
    font-size: 13px;
    user-select: none;
`
:
styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 15px;
    font-size: 13px;
`