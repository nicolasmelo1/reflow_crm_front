import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 1px solid #f2f2f2;
    background-color: ${props=> props.isConditional ? '#17242D': 'white'};
    color: ${props=> props.isConditional && !props.isMultiSection ? '#fff': '#17242D'};
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px
`
:
styled(View)``