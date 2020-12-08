import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    margin: 0 0 10px 0;
    border-radius: 20px;
    background-color: #0dbf7e;
    border: 1px solid #0dbf7e;   
    padding: 0 10px;
    color: #17242D;

    &:hover {
        color: #0dbf7e;
        background-color: #17242D;
        border: 1px solid #17242D;   
    }
`
:
styled(View)``