import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.button`
    padding: 5px 10px;
    background-color: #0dbf7e;
    border-radius: 20px;
    border: 0;
    margin: 10px;
    &:hover {
        background-color: #fff;
        color: #0dbf7e
    }
`
:
styled(({...rest}) => <Text {...rest}/>)`
    color: #0dbf7e;
    font-size: 19px;
`