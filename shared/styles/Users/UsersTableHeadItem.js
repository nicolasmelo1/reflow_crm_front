import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.th`
    color: ${props => props.isEditOrDeleteColumn ? '#f2f2f2' : '#0dbf7e'};
    padding: 10px;
    background-color: #17242D;
    border-radius: ${props => props.isFirstColumn ? '10px 0 0 0' : props.isLastColumn ? '0 10px 0 0' : '0'}
`
:
styled(View)`
    color: ${props => props.isEditOrDeleteColumn ? '#f2f2f2' : '#0dbf7e'};
    padding: 10px;
    background-color: #17242D;
    align-self: stretch;
    width:  ${props => props.isEditOrDeleteColumn ? '100px' : '200px'};
`