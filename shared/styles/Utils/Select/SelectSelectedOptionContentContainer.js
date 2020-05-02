import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    display: inline-block;
    padding: .156rem .7rem;
    border-radius: 20px;
    background-color: ${props => props.selected ? '#bfbfbf' : props.color};
    color: ${props => props.selected ? '#17242D' : '#fff'};
    &:hover {
        color: #17242D;
        background-color: #bfbfbf
    }
`
:
null