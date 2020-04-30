import React from 'react'
import styled from 'styled-components'


export default process.env['APP'] === 'web' ?
styled.a`
    color: ${props=> props.isOpen ? '#0dbf7e' : '#444'} !important;
    &:hover {
        color: #0dbf7e !important;
    }
`
:
null