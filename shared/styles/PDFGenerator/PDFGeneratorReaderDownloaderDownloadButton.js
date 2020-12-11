import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border: 1px solid #17242D;
    background-color: #17242D;
    color: #0dbf7e;
    border-radius: 5px;
    padding: 5px 10px;

    &:hover {
        border: 1px solid #0dbf7e;
        background-color: #0dbf7e;
        color: #17242D;
    }  
`
:
styled(View)``