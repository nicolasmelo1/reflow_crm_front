import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.button`
    border: 0;
    background-color: transparent;
    padding: 0;
    &:hover{
        background-color: #bfbfbf;
        border-radius: 2px;
    }
`
: 
null