import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'
import dynamicImport from '../../utils/dynamicImport'

const Button = dynamicImport('react-bootstrap', 'Button')

export default process.env['APP'] === 'web' ?
styled(Button)`
    background-color: #20253F;
    border: 0;
    width: 100%;
    padding: 5px 5px;
    &:hover {
        background-color: #0dbf7e;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }
`
:
styled(TouchableOpacity)``