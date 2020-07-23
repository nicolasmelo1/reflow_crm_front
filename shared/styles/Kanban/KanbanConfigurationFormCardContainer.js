import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    box-shadow: 0 3px 6px #17242D;
    border-radius: 5px;
    padding: 10px;
    display: inline-block;
    margin: 5px;
    width: 200px;
    vertical-align: top;
    cursor: pointer;
    color: ${props => props.isSelected ? '#f2f2f2': '#17242D'};
    background-color: ${props => props.isSelected ? '#17242D': '#f2f2f2'};
`
:
styled(View)``