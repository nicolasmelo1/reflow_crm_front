import React from 'react'
import styled from 'styled-components'
import { Image } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    opacity: ${props => props.showLogo ? '1 !important': '0 !important'};
    top: ${props => props.slideLogo ? '10px': '48%'};
    transition: top 1s ease-in-out, opacity 0.9s ease-in-out;
    max-width: 30%;
`
:
styled(Image)``