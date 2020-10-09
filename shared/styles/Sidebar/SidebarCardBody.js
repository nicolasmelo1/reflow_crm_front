import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    padding: 0 1.25rem;
    border-bottom: 1px solid #444;
    text-align: left;
`
:
null