import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 0;
    background-color: white !important;
    color: #17242D;
    border: 1px solid ${props=> props.errors ? 'red': '#0dbf7e'};
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-clip: padding-box;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;


    &:focus {
        color: #17242D;
        background-color: white;
        border: 1px solid #17242D;
        box-shadow: none;
        outline: 0;
    }
`
:
styled(View)``