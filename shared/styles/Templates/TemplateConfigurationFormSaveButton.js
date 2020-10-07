import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 100%;
    background-color: #0dbf7e;
    padding: 10px;
    border: 0;
    border-radius: 20px;
    margin-bottom: 10px;
`
:
styled(TouchableOpacity)`
    width: 100%;
    background-color: #0dbf7e;
    padding: 10px;
    border: 0;
    border-radius: 20px;
`