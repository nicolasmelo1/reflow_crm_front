import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    margin: auto;
    text-align: center;
    margin: 0 10px 5px 10px;
    ${props=> props.isTableButton ? '': 'cursor: pointer;'};
    height: 20px
`
:
styled(View)``