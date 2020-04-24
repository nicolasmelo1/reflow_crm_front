import React from 'react'
import styled from 'styled-components'
import { Accordion } from 'react-bootstrap'


export default process.env['APP'] === 'web' ? 
styled(Accordion)`
    background-color: transparent;
    border-radius: 0;
    border: 0;
    color: #ffffff
`
:
null