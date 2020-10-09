import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    border: 0;
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: transparent;
`
:
null