import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: #fff;
    border: 0;
    width: 100%;
    color: #20253F;
    padding: 5px 10px;
    border-radius: 4px;
    box-shadow: 2px 2px 16px rgba(190, 205, 226, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1);
    font-size: 13px;

    &:hover {
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
    &:active {
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
`
:
styled(TouchableOpacity)`
    background-color: #20253F;
    padding: 10px;
    margin: 0 10px 5px 10px;
    border-radius: 5px;
    flex-direction: row;
    justify-content: center;
`