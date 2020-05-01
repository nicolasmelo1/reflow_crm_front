import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'


export default process.env['APP'] === 'web' ? 
styled.button`
    display: inline-block;
    padding: .156rem .375rem;
    margin: .156rem 0 .156rem .375rem;
    background-color: ${props => props.selected ? '#bfbfbf' : props.color};
    border-radius: 5px;
    border: 0;
    color: ${props => props.selected ? '#17242D' : '#fff'};
    transiton: color 0.3s ease-in-out;
    &:hover {
        color: #17242D;
        background-color: #bfbfbf
    }
`
:
styled(TouchableOpacity)`
    padding: 5px 5px;
    margin: 2px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.selected ? '#bfbfbf' : props.color};
    border-radius: 5px;
    border: 0;
    color: ${props => props.selected ? '#17242D' : '#fff'};
`
