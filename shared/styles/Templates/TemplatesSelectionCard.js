import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: ${props => props.isSelected ? 'var(--app-height)': '150px'};
    width: ${props => props.isSelected ? 'var(--app-width)': '150px'};
    position: ${props => props.isSelected ? 'absolute': 'relative'};
    top: ${props => props.isSelected ? '0': 'auto'};
    left: ${props => props.isSelected ? '0': 'auto'};
    background-color: #fff;
    border-radius: 5px;
    transition: width 1s ease-in-out, height 1s ease-in-out;
`
:
styled(View)``