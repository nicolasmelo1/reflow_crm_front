import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 1px solid #f2f2f2;
    background-color: ${props=> props.isConditional ? '#20253F': 'white'};
    color: ${props=> props.isConditional && !props.isMultiSection ? '#fff': '#20253F'};
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 10px;
    box-shadow: rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 4px 3px;
`
:
styled(View)``