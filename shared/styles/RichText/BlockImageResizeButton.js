import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    height: 40px;
    background-color: #000;
    width: 5px;
    border: 1px solid #f2f2f2;
    margin: 5px;
    border-radius: 20px;
    padding: 0;
    cursor: col-resize
`
:
styled(TouchableOpacity)``