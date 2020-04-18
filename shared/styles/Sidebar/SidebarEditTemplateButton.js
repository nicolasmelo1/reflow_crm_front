import React from 'react'
import styled from 'styled-components'
import { Button as ReactBootstrapButton} from 'react-bootstrap'
import { Button } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled(ReactBootstrapButton)`
    background-color: #0dbf7e;
    border-radius: 20px;
    border: 0;
    margin: 10px 5px;
    &:hover {
        background-color: #fff;
        color: #0dbf7e
    }
`
:
styled(({...rest}) => <Button color="#0dbf7e" {...rest}/>)`
`