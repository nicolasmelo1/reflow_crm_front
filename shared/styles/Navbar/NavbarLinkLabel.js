import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.p`
    font-weight: 400;
    display: inline-block;
    color: #444;
    margin:0;
`
:
null