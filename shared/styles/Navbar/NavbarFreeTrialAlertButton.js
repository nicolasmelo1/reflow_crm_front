import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #0dbf7e;
    border-radius: 5px;
    color: #fff;
    background-color: #0dbf7e;
    width: 200px
`
:
styled(TouchableOpacity)``