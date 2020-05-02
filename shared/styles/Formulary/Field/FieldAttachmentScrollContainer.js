import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow-x: auto;
    white-space: nowrap
`
:
null