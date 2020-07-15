import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;

    @media(min-width: 640px) {
        flex-direction: row;
        justify-content: space-between;
    }

    @media(max-width: 640px) {
        overflow: ${props => props.hideTopButtons ? 'hidden' : 'none'};
        max-height: ${props => props.hideTopButtons ? '0': '300px'};
        transition: max-height 0.3s ease-in-out;
        flex-direction: column;
        flex-flow: column;
    }
`
:
styled(View)`
    flex-direction: column;
`