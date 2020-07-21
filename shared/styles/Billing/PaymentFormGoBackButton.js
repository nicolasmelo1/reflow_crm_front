import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: #17242D;
    font-size: 20px;
    background-color: transparent;
    border: 0;
    
    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    align-self: center;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
`