import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.div`
    margin: auto;
    border-radius: 20px;
    position: relative;
    text-align: center;
    color: #fff
`
:
null