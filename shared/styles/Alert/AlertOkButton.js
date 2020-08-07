import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: #0dbf7e;
    border-radius: 5px;
    border: 1px solid #0dbf7e;
    padding: 10px;
    width: 120px;
`
:
styled(TouchableOpacity)``