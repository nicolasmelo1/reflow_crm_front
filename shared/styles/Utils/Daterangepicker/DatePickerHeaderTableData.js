import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.th`
    color: #17242D;
    text-align: center
`
:
null