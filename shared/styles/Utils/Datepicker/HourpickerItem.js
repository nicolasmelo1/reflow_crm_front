import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.td`
    color: #fff;
    text-align: center;
    vertical-align: middle;
    font-size: 30px;
    width: 33.3% !important;
    font-weight: bold;
`
:
null