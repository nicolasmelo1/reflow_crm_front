import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.th`
    color: #20253F;
    text-align: center
`
:
null