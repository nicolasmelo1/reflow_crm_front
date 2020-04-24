import React from 'react'
import styled from 'styled-components'
import Navbar from 'react-bootstrap/Navbar'

export default process.env['APP'] === 'web' ? 
styled(Navbar.Collapse)``
:
null