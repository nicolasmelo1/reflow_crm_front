import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border-radius: 50px;
    padding: 5px 10px;
    border: 0;
    background-color: #0dbf7e;
    margin-bottom: 5px;
    color: #fff;
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