import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: var(--app-height);

    @media(min-height: 580px) {
        justify-content: center;

    }

    @media(max-height: 580px) {
        justify-content: ${props => props.step === 0 ? 'flex-end' : 'center'};

    }
`
:
styled(View)``