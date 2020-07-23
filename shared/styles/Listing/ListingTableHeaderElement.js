import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    color: ${props=> props.isTableButton ? '#0dbf7e': '#f2f2f2'} !important;
    border: 1px solid #bfbfbf;
    height: ${props=> props.isTableButton ? '': '100%'};
    background-color: #17242D;
    text-align: ${props=> props.isTableButton ? 'center': 'left'};
    position: relative;
    user-select: none;
`
:
styled(View)``