import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    background-color: transparent;
    position: relative;
`
:
styled(View)`
    flex-direction: column;
    height: ${props => props.height ? props.height : '97%'};
`