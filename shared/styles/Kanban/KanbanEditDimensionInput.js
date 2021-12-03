import React from 'react'
import styled from 'styled-components'
import { TextInput } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    border: 0;
    background-color: white !important;
    color: #20253F;
    border: 2px solid #f2f2f2;
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem 5px;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    background-clip: padding-box;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;


    &:focus {
        color: #20253F;
        background-color: white;
        border: 2px solid #20253F;
        box-shadow: none;
        outline: 0;
    }
`
:
styled(TextInput)``