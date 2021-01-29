import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    cursor: pointer !important;
    border: ${props => props.isValid ? '1px solid #0dbf7e' : '1px solid #f2f2f2'};
    background-color: ${props => props.isValid ? '#0dbf7e' : '#f2f2f2'};
    padding: 5px 15px;
    border-radius: 5px;
    margin-right: 5px;
    color: ${props => props.isValid ? '#17242D' : '#bfbfbf'};

    ${props => props.isValid ? `
        &:hover {
            color: #0dbf7e;
            border: 1px solid #17242D;
            background-color: #17242D;
        }
    ` : ''}
`
:
styled(TouchableOpacity)``