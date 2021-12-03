import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    box-shadow: 4px 4px 12px rgb(56 66 95 / 0.08);
    border-radius: 5px;
    padding: 10px;
    display: inline-block;
    margin: 5px;
    width: 200px;
    vertical-align: top;
    cursor: pointer;
    color: #20253F;
    background-color: ${props => props.isSelected ? '#f2f2f2': '#f2f2f250'};
`
:
styled(View)``