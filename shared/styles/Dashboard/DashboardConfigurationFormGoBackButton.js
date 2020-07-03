import React from 'react'
import styled from 'styled-components'
import { Button, TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: #172424D;
    border: 0;
    margin: 10px 0;
    padding: 0;
    background-color: transparent
`
:
styled(TouchableOpacity)`
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
`