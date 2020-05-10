import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 150px;
    width: 150px;
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
styled(TouchableOpacity)`
    height: 150px;
    margin: 1%;
    width: 48%;
    background-color: #fff;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    text-align: center;
    align-self: flex-start;
`