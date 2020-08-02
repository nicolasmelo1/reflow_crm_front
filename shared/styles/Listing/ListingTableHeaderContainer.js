import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.th`
    padding: 0 !important;
    position: sticky;
    top: 0
`
:
null