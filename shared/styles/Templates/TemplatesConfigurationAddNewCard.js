import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 200px;
    width: 200px;
    border: 1px dashed #0dbf7e;
    background-color: transparent;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    display:flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    padding: 10px;

    @media(max-width: 390px) {
        margin: 10px auto;
    }

    @media(min-width: 390px) {
        float: left;
        margin: 10px;
    }
`
:
styled(TouchableOpacity)`
    height: 200px;
    width: 200px;
    border: 1px solid #0dbf7e;
    background-color: #fff;
    border-radius: 5px;
    text-align: center;
    align-self: center;
    margin: 10px auto;
    display:flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
`