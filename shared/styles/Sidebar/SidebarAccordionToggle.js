import React from 'react'
import styled from 'styled-components'
import { Card, Accordion } from 'react-bootstrap'

export default process.env['APP'] === 'web' ?
styled(Accordion.Toggle)`
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    border: 0;
    color: #ffffff;
    width: 100%
`
:
null