import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    background-color: transparent;
    border-radius: 0;
    border: 0;
    color: #fff
`
:
null