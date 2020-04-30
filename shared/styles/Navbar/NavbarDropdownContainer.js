import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    padding: 10px;
    position: relative;
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