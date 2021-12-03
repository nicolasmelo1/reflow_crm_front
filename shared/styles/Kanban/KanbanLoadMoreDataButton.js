import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    margin: 5px 0;
    text-align: left;
    width: 100%;
    border: 0;
    background-color: transparent;
    color: #20253F;

    &:hover {
        color: #0dbf7e
    }
    
`
:
styled(TouchableOpacity)``