import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 100%;
    border-radius: 5px;
    border: 1px solid #20253F;
    padding: 5px 0;
    background-color: #20253F;
    color: #f2f2f2;

    &:hover {
        background-color: #f2f2f2;
        color: #20253F;
        border: 1px solid #bfbfbf;
    }
`
:
styled(TouchableOpacity)``