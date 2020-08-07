import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: fixed; 
    display: ${props => props.show ? 'flex': 'none'}; 
    justify-content: center; 
    align-items: center;
    top: 0;
    left: 0;
    width: var(--app-width);
    height: var(--app-height);
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 11;
    opacity: ${props => props.isOpen ? '1': '0'};
    transition: opacity 0.3s ease-in-out;
`
:
styled(View)``