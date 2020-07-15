import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    overflow: hidden;

    @media(min-width: 640px) {
        flex-direction: row;
        justify-content: space-between;
    }

    @media(max-width: 640px) {
        max-height: ${props => props.hideTopButtons ? '0': '300px'};
        transition: max-height 0.3s ease-in-out;
        flex-direction: column;
        flex-flow: column;
    }
`
:
styled(View)``