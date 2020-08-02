import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    vertical-align: top;
    padding: 10px;

    @media(min-width: 640px) {
        width: 50%;
        display: inline-block;
    }
`
:
styled(View)`
    padding: 10px;
    height: 400px;
    ${props => props.chartType === 'card' ? `align-items: center;` : ''}
    width: 100%;
`