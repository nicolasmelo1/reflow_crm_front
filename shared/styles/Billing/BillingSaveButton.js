import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: #0dbf7e;
    border-radius: 20px;
    width: calc(100% - 20px);
    padding: 10px;
    margin: 10px;
    position: fixed;
    bottom: 0;
    left: 0
`
:
styled(TouchableOpacity)``