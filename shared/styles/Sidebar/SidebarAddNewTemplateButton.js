import React from 'react'
import styled from 'styled-components'
import { Button as ReactBootstrapButton } from 'react-bootstrap'
import { Button } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(ReactBootstrapButton)`
    background-color: transparent;
    border-radius: 20px;
    border: 1px solid #0dbf7e;
    margin: 10px 5px;
    &:hover {
        border: 1px solid #fff;
        background-color: transparent;
        color: #0dbf7e
    }
` 
: 
styled(({...rest}) => <Button color="#0dbf7e" {...rest}/>)`
`