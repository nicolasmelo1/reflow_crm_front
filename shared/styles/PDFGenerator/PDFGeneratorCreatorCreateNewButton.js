import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    background-color: #0dbf7e;
    color: #17242D;
    padding: 5px 15px;
    border-radius: 5px;
    
    &:hover {
        background-color: #17242D;
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)``