import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.a`
    padding: 10px;
    color: #444;
    &:hover {
        color: #0dbf7e;
    }

    @media(max-width: 564px) {
        display: block;
        text-align: center;
    }
    @media(min-width: 565px) {
        float: left;
    }
`
:
null