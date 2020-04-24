import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?
styled.div`
    margin: 10px 0;
`
:
null