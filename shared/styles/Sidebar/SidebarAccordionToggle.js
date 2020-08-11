import React from 'react'
import styled from 'styled-components'
import { Card, Accordion } from 'react-bootstrap'

export default process.env['APP'] === 'web' ?
styled(({isSelected, ...rest}) => <Accordion.Toggle {...rest}/>)`
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    border-top: 0;
    border-left: 0;
    border-right: 0;
    border-bottom: 0;
    color: ${props => props.isSelected ? "#0dbf7e" : "#fff"};
    font-weight: ${props => props.isSelected ? "bold" : "normal"};
    width: 100%
`
:
null