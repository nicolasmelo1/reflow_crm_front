import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 723px) {
        float: right;
        padding: 10px;
        cursor: pointer;
    }
    @media(min-width: 724px) {
        display: none;
    }
`
:
null