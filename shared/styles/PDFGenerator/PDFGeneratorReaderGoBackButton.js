import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    color: #17242D;

    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
`