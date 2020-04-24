import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default process.env['APP'] === 'web' ? 
styled(FontAwesomeIcon)`
    display: inline-block;
    margin-right: 4px;
    color: #444;
`
:
null