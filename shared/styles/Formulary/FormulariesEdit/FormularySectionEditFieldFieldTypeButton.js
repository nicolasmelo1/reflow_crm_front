import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 5px;
    color: #f2f2f2;
    padding: 3px;
    background-color: #20253F;
    border: 1px solid #20253F;

    &:hover {
        background-color: #f2f2f2;
        color: #20253F;
        border: 1px solid #bfbfbf;
    }
`
:
styled(TouchableOpacity)``