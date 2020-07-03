import React from 'react'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled(Button)`
    background-color: #17242D;
    border: 0;
    padding: 5px 10px;
    color: #f2f2f2;
    margin-bottom: 10px;

    &:hover {
        background-color: #0dbf7e;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }

    @media(min-width: 640px) {
        width: auto;
    }
    @media(max-width: 640px) {
        width: 100%;
    }
`
:
styled(TouchableOpacity)``