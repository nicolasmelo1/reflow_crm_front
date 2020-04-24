import React from 'react'
import styled from 'styled-components'
import { Card } from 'react-bootstrap'

export default process.env['APP'] === 'web' ? 
styled(Card.Body)`
    padding: 0 1.25rem;
`
:
null