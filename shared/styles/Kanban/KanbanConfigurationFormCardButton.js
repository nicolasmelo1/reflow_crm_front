import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    width: 48%;
    display: inline-block;
    border: 0;
    margin: 1%;
    background-color: transparent
`
:
styled(TouchableOpacity)