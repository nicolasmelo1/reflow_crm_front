import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
 styled.button`
    background-color: #fff;
    margin: 5px 5px 0 0;
    border: 0;
    color: #17242D;
    padding: 5px 10px;
    border-radius: .25rem;
    
    &:hover {
        background-color: #fff;
        border: 0;
        color: #0dbf7e
    }
    &:active {
        background-color: #fff !important;
        border: 0;
        color: #0dbf7e
    }
`
:
styled(TouchableOpacity)`
    background-color: #0dbf7e;
    bottom: 0;
    margin-top: auto;
    margin-bottom: 10px;
    margin-right: 10px;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    padding: 10px
`