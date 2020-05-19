import React from 'react'
import styled from 'styled-components'
import { Image } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    opacity: ${props => props.showLogo ? '1 !important': '0 !important'};
    transition: top 1s ease-in-out, opacity 0.9s ease-in-out;
    max-width: 30%;

    @media(min-height: 711px) {
        top: ${props => props.slideLogo ? '10px': '48%'};
    }

    @media(max-height: 711px) {
        top: ${props => props.slideLogo ? props.step === 0 ? '-45px' : '10px' : '48%'};
    }
`
:
styled(Image)``