import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components'
import dynamicImport from '../../../utils/dynamicImport'

const Form = dynamicImport('react-bootstrap', 'Form')

export default process.env['APP'] === 'web' && Form ? 
styled(Form.Label)`
    display: inline-block;
    margin: 0;
    font-weight: 600;
    color: red
`
:
styled(Text)