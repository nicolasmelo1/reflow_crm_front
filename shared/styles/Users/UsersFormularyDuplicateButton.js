import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    border: 1px solid #0dbf7e;
    color: #0dbf7e;
    border-radius: 20px;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px
`
:
styled(TouchableOpacity)``