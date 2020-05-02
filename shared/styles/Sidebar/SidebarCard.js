import React from 'react'
import styled from 'styled-components'
import { Card } from 'react-bootstrap'

export default process.env['APP'] === 'web' ? 
styled(Card)`
    background-color: transparent;
`
:
null