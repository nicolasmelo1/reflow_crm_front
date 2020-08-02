import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'
import Button from 'react-bootstrap/Button'

export default process.env['APP'] === 'web' ?
styled(Button)`
    background-color: #17242D;
    border: 0;
    width: 100%;
    padding: 5px 5px;
    &:hover {
        background-color: #0dbf7e;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }
`
:
styled(TouchableOpacity)``