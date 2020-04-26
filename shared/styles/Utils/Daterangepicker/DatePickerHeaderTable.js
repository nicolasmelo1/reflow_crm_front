import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ?  
styled.table`
    width: 100%;
    margin: 5px 0
`
:
null