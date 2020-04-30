import React from 'react'
import styled from 'styled-components'

export default process.env['APP'] === 'web' ? 
styled.img`
    object-fit: cover;
    height: 30px;
    width: 103.75px;
`
: 
null