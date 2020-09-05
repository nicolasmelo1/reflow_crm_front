import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.a`
    padding: 10px;
    color: #17242D;
    &:hover {
        color: #0dbf7e;
    }

    @media(max-width: 723px) {
        display: block;
        text-align: center;
    }
    @media(min-width: 724px) {
        float: left;
    }
`
:
null