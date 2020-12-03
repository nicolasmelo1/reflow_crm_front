import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    margin: 0px 0 0 0;
    padding: 0 ${props=> props.padding ? props.padding.toString() : '10'}px
`
:
styled(View)``