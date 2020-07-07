import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    background-color: #17242D;
    border: 0;
    padding: 5px 10px;
    color: #f2f2f2;
    border-radius: .25rem; 
    
    &:hover {
        background-color: #0dbf7e;
        border: 0;
    }
    &:active {
        background-color: #0dbf7e !important;
        border: 0;
    }

    @media(min-width: 640px) {
        width: auto;
        margin-bottom: 10px;
    }

    @media(max-width: 640px) {
        width: 100%;
        margin-bottom: 5px;
    }
`
:
styled(TouchableOpacity)``