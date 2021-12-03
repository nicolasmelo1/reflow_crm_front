import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: inline;
    padding: .156rem .3rem;
    border-radius: 100%;
    color: #fff;
    &:hover {
        color: #20253F;
        background-color: #bfbfbf
    }
`
:
styled(TouchableOpacity)``