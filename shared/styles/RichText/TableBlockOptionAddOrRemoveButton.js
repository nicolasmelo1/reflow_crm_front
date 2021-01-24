import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: transparent;
    border: 1px solid #f2f2f2;
    border-radius: 5px;
    height: 30px;
    margin: 0 2px;
    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
`