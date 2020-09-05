import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.small`
    position: absolute;
    width: 150px;
    top: 50%;
    transform: translate(0,-50%);
    text-align:center;
    color: #17242D;
    font-weight: bold;
    background-color: #fff;
    margin: 0;
`
:
styled(Text)``