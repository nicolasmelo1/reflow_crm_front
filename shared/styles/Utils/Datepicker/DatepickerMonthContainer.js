import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.div`
    margin: auto;
    text-align: center;
    color: #0dbf7e;
    font-weight: bold
`
:
null