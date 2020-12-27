import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #0dbf7e;
    background-color: transparent;
    border-radius: 5px;
    margin-right: 5px;
    padding: 5px 15px;
    color: #0dbf7e;

    &:hover {
        color: #17242D;
        border: 1px solid #17242D;
    }
`
:
styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
`