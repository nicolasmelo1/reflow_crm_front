import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.div`
    position: relative;
    width: 100%
`
:
null