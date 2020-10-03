import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    height: 150px;
    width: 150px;
    border: 0;
    background-color: #fff;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    display:flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    @media(max-width: 390px) {
        margin: 10px auto;
    }

    @media(min-width: 390px) {
        float: left;
        margin: 10px;
    }
`
:
styled(View)``