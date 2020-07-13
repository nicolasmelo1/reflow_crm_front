import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`
:
styled(View)`
    width: 100%;
    height: 75%;
    justify-content: center;
    ${props => props.chartType === 'card' ? 'align-items: center;' : ''}
`