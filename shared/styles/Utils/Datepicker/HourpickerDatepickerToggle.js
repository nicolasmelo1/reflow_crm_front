import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    width: 100%;
    text-align: center;
    color: #fff;
    vertical-align: middle;
    border-radius: 10px;
    &:hover {
        background-color: #fff;
        color: #0dbf7e;
    }
`
:
null