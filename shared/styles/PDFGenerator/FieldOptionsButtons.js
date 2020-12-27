import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    display: block;
    border: 0;
    background-color: transparent;
    color: #17242D;
    width: 100%;
    text-align: left;
    padding: 5px;
    font-size: 12px;
    
    &:hover {
        background-color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    padding: 10px; 
    ${props => props.isFirst ? `` : `
        border-top-width: 1px;
        border-top-color: #f2f2f2;
    `}
`