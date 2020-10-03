import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.label`
    background-color: #fff;
    padding: 5px;
    border-radius: 4px;
    user-select: none;
`
:
styled(View)`
    flex-direction: row;
    flex-wrap: wrap
`
