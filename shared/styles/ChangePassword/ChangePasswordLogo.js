import React from 'react'
import styled from 'styled-components'
import { Image } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    max-width: 30%;
    top: 10px;
`
:
styled(Image)`
    width: 50%;
    resize-mode: contain;
`