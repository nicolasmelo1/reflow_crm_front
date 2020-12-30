import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 0;
    background-color: transparent;
    border-radius: 2px;
    color: #17242D;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    
    &:hover {
        background-color: #0dbf7e20
    }
`
:
styled(View)``