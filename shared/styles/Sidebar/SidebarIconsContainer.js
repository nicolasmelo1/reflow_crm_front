import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.div`
    margin-bottom: 5px;
    height: 1em;
`
:
null