import React from 'react'
import styled from 'styled-components'
import { Navbar } from 'react-bootstrap'

export default process.env['APP'] === 'web' ? 
styled(Navbar.Brand)`
    max-height: 40px;
    max-width: 200px;
`
:
null