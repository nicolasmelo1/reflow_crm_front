import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.h2`
    margin: 0;
    color: ${props => props.formIsOpen || props.isNew ? '#17242D' : '#0dbf7e'};
    user-select: none;
    justify-content: space-between;
    align-items: center;
    display: flex;
`
:
styled(Text)`
    margin: 0;
    font-size: 20px;
    color: ${props => props.formIsOpen || props.isNew ? '#17242D' : '#0dbf7e'};
`