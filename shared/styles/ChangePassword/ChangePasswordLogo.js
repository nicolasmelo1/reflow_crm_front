import React from 'react'
import styled from 'styled-components'
import { Image } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    width: 30%;
    max-width: 200px;
    top: 10px;
`
:
styled(Image)`
    width: 50%;
    resize-mode: contain;
`