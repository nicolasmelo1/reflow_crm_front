import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 200px;
    width: 200px;
    border: 1px dashed #17242D;
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
    border-width: 2px;
    height: 250px;
    width: 250px;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`