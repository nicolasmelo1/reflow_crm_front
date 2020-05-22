import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    margin-top: 10px;
    color: #0dbf7e;
    background-color: #f2f2f2;
    border-radius: 20px;
    border: 1px solid #0dbf7e;
    width: 100%;
    padding: 5px;   
`
:
styled(TouchableOpacity)`
    background-color: #f2f2f2;
    border-radius: 20px;
    border: 1px solid #0dbf7e;
    margin: 5px 0;
    padding: 10px;
    align-items: center;
`