import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.td`
    color: #fff;
    user-select: none;
    text-align: center !important;
    vertical-align: middle;
    font-size: 30px;
    width: 33.3% !important;
    font-weight: bold;
`
:
null