import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 564px) {
        float: right;
        padding: 10px;
        cursor: pointer;
    }
    @media(min-width: 565px) {
        display: none;
    }
`
:
null