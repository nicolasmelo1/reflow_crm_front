import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: #0dbf7e;
    border: 1px solid #0dbf7e;
    border-radius: 20px;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px
`
:
styled(TouchableOpacity)`
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 15px 0;
    align-items: center;
    background-color: #0dbf7e;
    border-radius: 5px;
    border-width: 1px;
    border-color: #0dbf7e
`