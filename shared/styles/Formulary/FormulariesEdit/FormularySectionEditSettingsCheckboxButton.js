import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    color: ${props => props.isConditional ? '#f2f2f2' : '#17242D'};
    border: ${props => props.isSelected ? '1px solid #0dbf7e' : '1px solid red'};
    border-radius: 10px;
    padding: 10px; 
    display: flex; 
    align-items: center; 
    background-color: transparent;
    width: 100%;
    margin-bottom: 10px
`
:
styled(View)``