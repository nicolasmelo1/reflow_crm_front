import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'
import dynamicImport from '../../utils/dynamicImport'

const InputGroup = dynamicImport('react-bootstrap', 'InputGroup')

export default process.env['APP'] === 'web'?
styled(InputGroup)`
    margin: 0 0 5px 0;
`
:
styled(View)`
    border-radius: 5px;
    border-width: 1px;
    padding: 10px;
    border-color: #f2f2f2;
    margin-top: 0;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
`