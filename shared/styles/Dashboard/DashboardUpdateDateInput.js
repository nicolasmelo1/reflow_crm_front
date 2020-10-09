import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.input`
    margin: 0;
    color: #0dbf7e;
    font-weight: bold; 
    border: 0;
    text-align: center; 
    background-color: transparent;
    cursor: pointer;
    min-width: 200px;

    @media(max-width: 640px) {
        width: 100%;
    }
`
:
styled(Text)``