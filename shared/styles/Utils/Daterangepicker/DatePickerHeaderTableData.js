import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.th`
    color: #444;
    text-align: center
`
:
null