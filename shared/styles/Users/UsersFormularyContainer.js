import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: fixed;
    left: 0;
    bottom: ${props=> props.isOpen ? `0`: '-20px'}; 
    width: 100%;
    height: ${props=> props.isOpen ? `var(--app-height)`: '0'};
    z-index: 5;
    overflow: hidden;
    padding: 10px;
    background-color: #fff;
    transition: height 0.3s ease-in-out, bottom 0.3s ease-in-out
`
:
styled(View)``