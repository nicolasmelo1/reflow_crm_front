import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.button`
    background-color: red;
    border: 0;
    border-radius: 5px;
    color: #fff;
    display: block;
    margin: auto auto 10px auto
`
:
styled(TouchableOpacity)``