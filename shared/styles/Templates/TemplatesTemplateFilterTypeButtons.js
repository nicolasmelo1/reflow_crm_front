import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: #17242D;
    border-radius: 20px;
    padding: 0 15px;
    overflow: hidden;
    display: inline-block;
    vertical-align:top;
    margin: 5px;
`
:
styled(TouchableOpacity)``