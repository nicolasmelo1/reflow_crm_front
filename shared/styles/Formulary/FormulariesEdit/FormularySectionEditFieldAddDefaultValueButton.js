import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 100%;
    border-radius: 5px;
    border: 0;
    padding: 5px 0;
    background-color: #17242D;
    color: #f2f2f2;

    &:hover {
        background-color: #f2f2f2;
        color: #17242D;

    }
`
:
styled(TouchableOpacity)``