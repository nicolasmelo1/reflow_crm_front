import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled(Navbar.Toggle)`
    border: 0;
    color: #f2f2f2
`
: 
null