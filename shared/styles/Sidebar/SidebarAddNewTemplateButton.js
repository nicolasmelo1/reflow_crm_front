import React from 'react'
import styled from 'styled-components'
import { Button } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.button`
    padding: 5px 10px;
    background-color: transparent;
    border-radius: 20px;
    border: 1px solid #0dbf7e;
    margin: 10px;
    color: #f2f2f2;

    &:hover {
        border: 1px solid #fff;
        background-color: transparent;
        color: #0dbf7e
    }
` 
: 
styled(({...rest}) => <Button color="#0dbf7e" {...rest}/>)`
`