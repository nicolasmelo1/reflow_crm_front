import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'


export default process.env['APP'] === 'web' ?
styled(FontAwesomeIcon)`
    color: ${props=>(props.type ==='form') ? '#0dbf7e':'#fff'};
    float: right;
    margin: 0 5px;
    cursor: pointer;
`
:
null
