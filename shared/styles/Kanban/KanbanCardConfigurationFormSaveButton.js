import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: #20253F;
    border: 1px solid #20253F;
    color: #f2f2f2;
    border-radius: .225rem;
    &:hover {
        background-color: #0dbf7e;
        border: 1px solid #0dbf7e;
        color: #20253F;
    }
`
:
styled(TouchableOpacity)``