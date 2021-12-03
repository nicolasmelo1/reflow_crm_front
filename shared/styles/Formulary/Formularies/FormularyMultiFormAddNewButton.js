import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 100%;
    color: #20253F; 
    background-color: #0dbf7e;
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
    border: 0;

    &:hover {
        background-color: #0dbf7e90;
    }
`
:
styled(TouchableOpacity)``