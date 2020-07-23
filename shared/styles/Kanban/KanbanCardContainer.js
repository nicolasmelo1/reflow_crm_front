import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    box-shadow: 0 3px 6px #17242D;
    border-radius: 5px;
    padding: 10px;
    width: 250px;
    margin: 5px;
    cursor: pointer;
    color: #17242D;
    background-color: #fff;
`
:
styled(View)``