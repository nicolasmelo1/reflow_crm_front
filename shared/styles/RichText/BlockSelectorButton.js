import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    display: block; 
    width: 100%; 
    text-align: left;
    height: 50px;
    border-bottom: 1px solid #f2f2f2; 
    background-color: transparent;
    color: #20253F;
    border-left: 0; 
    border-top:0; 
    border-right: 0;

    &:hover {
        color: #0dbf7e !important
    }
`
:
styled(TouchableOpacity)`
    display: flex;
    flex-direction: row;
    padding: 15px;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #f2f2f2
`