import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #fff;
    position: fixed;
    z-index: 11;
    bottom: 0;
    left: 0;
    height: ${props => props.isOpen ? 'var(--app-height)': '0'};
    width: var(--app-width);
    color: #fff;
    padding: 10px;
    transition: height 0.3s ease-in-out;
`
:
styled(View)``