import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #17242D;
    border: 1px solid #f2f2f2;
    border-radius: 5px; 
    position: absolute;
    width: calc(100% - 20px)
`
:
styled(View)``