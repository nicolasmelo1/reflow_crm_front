import React from 'react'
import styled from 'styled-components'
import { Button } from 'react-bootstrap'
import { TouchableOpacity } from 'react-native'

export default styled(Button)`
    background-color: #fff;
    margin: 5px 5px 0 0;
    border: 0;
    color: #17242D;
    &:hover {
        background-color: #fff;
        border: 0;
        color: #0dbf7e
    }
    &:active {
        background-color: #fff !important;
        border: 0;
        color: #0dbf7e
    }
`