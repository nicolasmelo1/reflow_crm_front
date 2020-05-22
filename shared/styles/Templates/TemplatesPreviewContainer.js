import React from 'react'
import styled from 'styled-components'
import { SafeAreaView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    padding: ${props => props.isOpen ? '10px' : '0' };
    bottom: ${props => props.isOpen ? '0' : 'calc(0px - var(--app-height))' };
    left: 0;
    height: var(--app-height);
    width: var(--app-width);
    overflow: hidden;
    background-color: #fff;
    transition: bottom 0.3s ease-in-out, padding 0.3s ease-in-out;
    transform: translate3d(0,0,0);
`
:
styled(SafeAreaView)`
    padding: 10px;
`