import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border-radius: 5px;
    color: #0dbf7e;

    &:hover {
        color: #17242D;
        background-color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    width: 95%;
    height: 100%;
    flex-direction: row;
    align-items: center;
    margin: 5px 10px;
`