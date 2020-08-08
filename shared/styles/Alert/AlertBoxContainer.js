import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 300px;
    background-color: white;
    border-radius: 5px;
    transform: ${props => props.isOpen ? 'translateY(0px)': 'translateY(-100px)'};
    transition: transform 0.3s ease-in-out;
    white-space: normal !important;
`
:
styled(View)``