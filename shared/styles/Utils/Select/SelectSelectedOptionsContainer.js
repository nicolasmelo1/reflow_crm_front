import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 420px) {
        background-color:${props => props.isOpen ? '#fff': 'transparent'};
    }
`
:
styled(View)`
    flex-direction: row;
    flex-wrap: wrap
`
