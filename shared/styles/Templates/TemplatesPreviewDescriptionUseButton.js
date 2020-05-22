import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    padding: 10px;
    width: 100px;
    margin: 10px 0;
    border: 0;
    background-color: #0dbf7e;
    border-radius: 40px;
    color: #17242D;
`
:
styled(TouchableOpacity)`
    padding: 10px;
    width: 100px;
    border: 0;
    background-color: #0dbf7e;
    border-radius: 40px;
    align-items: center;
    color: #17242D;
`