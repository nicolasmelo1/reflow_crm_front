import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 10px 0;
`
:
null