import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    margin: 0 0 15px 0;
    width: 100%;
    background-color: #17242D;
    border-radius: 20px;
    border: 0;
    padding: 10px;
`
:
styled(TouchableOpacity)``