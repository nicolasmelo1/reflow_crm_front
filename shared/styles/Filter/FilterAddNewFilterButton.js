import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    border: 1px solid #0dbf7e;
    margin: 5px 5px 0 0;
    color: #20253F;
    font-weight: 600;
    font-size: 13px;
    padding: 5px 10px;
    border-radius: .25rem;

    &:hover {
        background-color: #0dbf7e50;
        box-shadow: inset 2px 2px 16px rgba(190, 205, 226, 0.4), inset -8px -8px 16px rgba(255, 255, 255, 0.1);
    }
    &:active {
        background-color: #fff !important;
    }
` 
:
styled(TouchableOpacity)`
    background-color: #fff;
    border-width: 1px;
    border-color: #20253F;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    padding: 10px
`