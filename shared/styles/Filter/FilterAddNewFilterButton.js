import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'
import { Button } from 'react-bootstrap'

export default process.env['APP'] === 'web' ?
styled(Button)`
    background-color: transparent;
    border: 1px solid #fff;
    margin: 5px 5px 0 0;
    color: #fff;
    &:hover {
        background-color: transparent;
        border: 1px solid #0dbf7e;
        color: #fff;
    }
    &:active {
        background-color: #fff !important;
        border: 0;
        color: black
    }
` 
:
styled(TouchableOpacity)`
    background-color: #fff;
    border-width: 1px;
    border-color: #17242D;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    padding: 10px
`