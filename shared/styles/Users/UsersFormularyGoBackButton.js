import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: transparent;
    color: #17242D;
    border: 0;
`
:
styled(TouchableOpacity)`
    height: 50px;
    flex-direction: row;
    alignItems: center;
    justify-content: center;
    width: 50px;
`