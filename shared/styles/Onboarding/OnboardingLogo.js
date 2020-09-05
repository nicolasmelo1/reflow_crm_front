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
    width: 30%;
    max-width: 200px;

    @media(min-height: 711px) {
        top: ${props => props.slideLogo ? '10px': '48%'};
    }

    @media(max-height: 711px) {
        top: ${props => props.slideLogo ? props.step === 0 ? '-45px' : '10px' : '48%'};
    }
`
:
styled(Image)`
    width: 50%;
    top: 10px;
    align-self: center;
    resize-mode: contain;
`