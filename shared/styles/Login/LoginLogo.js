import React from 'react'
import styled from 'styled-components'
import { Image } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    max-width: 30%;
    opacity: ${props => props.showLogo ? '1 !important': '0 !important'};
    transform: ${props => props.slideLogo ? 'translateY(-235px)': 'translateY(0px)'};
    transition: transform 1s ease-in-out, opacity 0.9s ease-in-out;
`
:
styled(Image)``