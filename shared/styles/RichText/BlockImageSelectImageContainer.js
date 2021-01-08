import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    border-radius: 5px;
    border: 1px solid #f2f2f2;
    background-color: #17242D;
    height: 50px;
    width: calc(100% - 20px)
`
:
styled(View)``