import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    margin: 5px;
    border: 0;
    background-color: transparent;
    color: #f2f2f2;
    border-radius: 5px;

    &:hover {
        background-color: #f2f2f2;
        color: #17242D;
    }
`
:
styled(View)``