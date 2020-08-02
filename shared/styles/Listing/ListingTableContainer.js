import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    text-align: center;
    overflow-x: auto;
    overflow-y: auto;
    position: relative;
    
    @media(max-width: 420px) {
        max-height: calc(var(--app-height) - ${props=> props.isMobile ? '285px' : '305px'});
    }
    @media(min-width: 420px) {
        max-height: calc(var(--app-height) - ${props=> props.isMobile ? '195px' : '215px'})
    }
`
:
styled(View)``