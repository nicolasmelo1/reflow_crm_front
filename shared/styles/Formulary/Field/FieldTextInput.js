import React from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components'
import dynamicImport from '../../../utils/dynamicImport'

const Form = dynamicImport('react-bootstrap', 'Form')

export default process.env['APP'] === 'web' && Form ? 
styled(Form.Control)`
    border: 0;
    background-color: white !important;
    color: #6a7074;
    border: 2px solid #F2F2F2 !important;

    &:focus {
        color: #6a7074;
        background-color: white;
        border: 2px solid #0dbf7e !important;
        box-shadow: none !important;
        outline: 0;
    }
`
:
styled(TextInput)