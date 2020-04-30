import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.p`
    font-weight: 400;
    display: inline-block;
    margin:0;
    user-select: none;
`
:
null