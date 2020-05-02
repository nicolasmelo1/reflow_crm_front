import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.div`
    border-bottom: 2px solid #f2f2f2;
    border-top: 2px solid #f2f2f2; 
    max-width: 80vw
`
:
null