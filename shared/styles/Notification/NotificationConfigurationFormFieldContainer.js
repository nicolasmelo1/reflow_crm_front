import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    margin: ${props => props.isVariable ? '0 0 5px 0' : '0 10px 5px 10px'};
`
:
styled(View)`
    margin: ${props => props.isVariable ? '0 0 5px 0' : '0 10px 5px 10px'};
`