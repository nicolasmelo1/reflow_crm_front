import React from 'react'
import styled from 'styled-components'
import { Image, TouchableOpacity, View } from 'react-native'

// ------------------------------------------------------------------------------------------
export const OnboardingLogo = process.env['APP'] === 'web' ?
styled.img`
    position: absolute;
    display: block;
    margin-bottom: 20px; 
    opacity: ${props => props.showLogo ? '1 !important': '0 !important'};
    transition: top 1s ease-in-out, opacity 0.9s ease-in-out;
    width: 30%;
    max-width: 200px;
    top: ${props => props.slideLogo ? props.step === 0 ? '14px' : '14px' : '48%'};
`
:
styled(Image)`
    width: 50%;
    top: 10px;
    align-self: center;
    resize-mode: contain;
`
// ------------------------------------------------------------------------------------------
export const OnboardingContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: var(--app-height);
    
    @media(min-height: 580px) {
        justify-content: center;

    }
`
:
styled(View)`
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`
// ------------------------------------------------------------------------------------------
export const OnboardingSelectTemplateOrUploaderContainer = process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`:
styled(View)``

export const OnboardingSelectTemplateOrUploaderButton = process.env['APP'] === 'web' ?
styled.button`
    border: 0;
    margin: 5px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    height: calc(var(--app-height) / 4);
    width: calc(var(--app-width) / 4);
    box-shadow: 2px 2px 16px rgba(190, 205, 226, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.1);
    font-size: 13px;

    &:hover {
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
    &:active {
        box-shadow: inset 2px 2px 4px rgba(190, 205, 226, 0.4), inset -8px -8px 4px rgba(255, 255, 255, 0.1);
        background-color: #0dbf7e50;
    }
`:
styled(TouchableOpacity)``