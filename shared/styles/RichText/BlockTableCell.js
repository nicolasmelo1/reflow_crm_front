import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.td`
    border: 1px solid ${props => props.borderColor ? props.borderColor : '#000'};
    padding: 10px;
    position: relative; 
    width: ${props => props.width}%;
    height: ${props => props.height}px
`
:
styled(View)`
    width: 320px;
    padding: 10px;
    border-color: ${props => props.borderColor ? props.borderColor : '#000'};
    ${props => props.isLastColumn ? `
        border-left-width: 1px; 
        border-right-width: 1px; 
    ` : `
        border-left-width: 1px; 
    `}
    ${props => props.isLastRow ? `
        border-top-width: 1px; 
        border-bottom-width: 1px; 
    ` : `
        border-top-width: 1px; 
    `}
`