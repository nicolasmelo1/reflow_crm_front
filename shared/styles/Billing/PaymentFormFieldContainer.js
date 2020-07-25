import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    margin-bottom: ${props => props.isLast ? '0' : '10px'};
`
:
styled(View)``