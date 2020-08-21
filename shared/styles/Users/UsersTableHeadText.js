import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    margin: 0;
    color: ${props => props.isEditOrDeleteColumn ? '#f2f2f2' : '#0dbf7e'};
`
:
styled(Text)`
    color: ${props => props.isEditOrDeleteColumn ? '#f2f2f2' : '#0dbf7e'};
`