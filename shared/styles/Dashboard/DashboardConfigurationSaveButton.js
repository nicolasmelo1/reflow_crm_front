import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    padding: 10px 20px;
    margin: 10px;
    background-color: #0dbf7e;
    border: 0;
    border-radius: 50px;
`
:
styled(TouchableOpacity)`
    justify-content: center;
    align-items: center;
    padding: 20px 10px;
    margin: 10px;
    background-color: #0dbf7e;
    border: 0;
    border-radius: 50px;
`