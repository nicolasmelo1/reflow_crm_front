import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    margin: 0;
    border: 0;
    width: 40px;
    background-color: transparent;
`
:
styled(TouchableOpacity)`
    margin: 0;
    border: 0;
    padding: 10px 10px 0 10px;
    align-content: center;
    justify-content: center;
    display: flex;
    flex-direction: row;
`