import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: #0dbf7e;
    color: #17242D;
    padding: 5px 15px;
    border-radius: 5px;
    
    &:hover {
        background-color: #17242D;
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    position: absolute;
    bottom: 10px;
    right: 10px;
    height: 60px;
    width: 60px;
    z-index: 5;
    alignItems: center;
    border-radius: 50px;
    padding: 5px 10px;
    border: 0;
    background-color: #0dbf7e;
    margin-bottom: 5px;
    color: #fff;
`