import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    display: inline-block;
    font-size: 30px;
    margin: 0 5px;
    cursor: pointer;
`
:
null