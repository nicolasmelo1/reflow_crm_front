import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.div`
    margin: 5px;
    display: inline-block;

    @media(min-width: 564px) {
        width: 47%;
    }
`
:
null