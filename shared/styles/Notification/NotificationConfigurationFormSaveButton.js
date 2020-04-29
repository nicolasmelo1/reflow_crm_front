import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.button`
    width: 100%;
    padding: 5px;
    color: #f2f2f2;
    border: 1px solid #444;
    margin: 5px 0;
    border-radius: 20px;
    background-color: #444;

    &:hover {
        color: #0dbf7e;
    }
`
:
styled(TouchableOpacity)`
    width: 100%;
    padding: 5px;
    color: #f2f2f2;
    border: 1px solid #444;
    margin: 5px 0;
    border-radius: 20px;
    background-color: #444;
    align-items: center;
`