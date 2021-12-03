import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border-radius: 5px;
    border: 0;
    background-color: #0dbf7e;
    color: #20253F;
    padding: 5px 10px;

    &:hover {
        background-color: #20253F;
        color: #0dbf7e;
    }
`
:
styled(View)``