import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: #0dbf7e;
    border-radius: 20px;
    width: 100%;
    padding: 10px;
    margin-top: 10px
`
:
styled(TouchableOpacity)``