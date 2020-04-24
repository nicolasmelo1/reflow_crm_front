import React from 'react'
import styled from 'styled-components'
import Navbar from 'react-bootstrap/Navbar'

export default process.env['APP'] === 'web' ? 
styled(Navbar)`
    border-bottom: 1px solid #707070;
    z-index: 2;
`
:
null
