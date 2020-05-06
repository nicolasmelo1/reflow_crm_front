import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    padding: ${props => props.isOpen ? '10px' : '0' };
    top: 0;
    left: 0;
    height: ${props => props.isOpen ? 'var(--app-height)' : '0' };
    width: ${props => props.isOpen ? 'var(--app-width)' : '0' };
    overflow: hidden;
    background-color: #fff;
    transition: width 0.3s ease-in-out, height 0.3s ease-in-out, padding 0.3s ease-in-out;
    transform: translate3d(0,0,0);
`
:
styled(View)``