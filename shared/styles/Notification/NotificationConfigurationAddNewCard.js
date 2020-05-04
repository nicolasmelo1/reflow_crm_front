import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 1px dashed #0dbf7e;
    padding: 5px;
    background-color: transparent;
    margin-top: 5px;
    min-height: 40px;
    border-radius: 4px;
    cursor: pointer;
`
:
styled(TouchableOpacity)`
    align-items: center;
    padding: 10px;
    min-height: 50px;
    border-bottom-width: 1px;
    border-bottom-color: #0dbf7e;
`