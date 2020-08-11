import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.a`
    color: ${props => props.isSelected ? '#0dbf7e !important' : '#bfbfbf !important'};

    &:hover {
        color: #0dbf7e !important;
    }
`
:
null