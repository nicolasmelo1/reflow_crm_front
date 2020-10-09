import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 200px;
    width: 200px;
    border: 1px solid #17242D;
    background-color: #fff;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    display:flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    user-select: none;
    padding: 10px;
    overflow: hidden;
    
    @media(max-width: 390px) {
        margin: 10px auto;
    }

    @media(min-width: 390px) {
        float: left;
        margin: 10px;
    }
`
:
styled(View)`
    height: 200px;
    width: 200px;
    border: 1px solid #17242D;
    background-color: #fff;
    border-radius: 5px;
    text-align: center;
    display:flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    margin: 10px auto;
`