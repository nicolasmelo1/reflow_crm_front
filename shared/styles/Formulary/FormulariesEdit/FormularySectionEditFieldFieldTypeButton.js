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
    background-color: #17242D;
    border: 1px solid #17242D;

    &:hover {
        background-color: #f2f2f2;
        color: #17242D;
        border: 1px solid #bfbfbf;
    }
`
:
styled(TouchableOpacity)``