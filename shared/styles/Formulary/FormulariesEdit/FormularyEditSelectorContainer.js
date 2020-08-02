import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #fff;
    border-radius: .25rem;
    border: 2px solid ${props => props.isOpen ? '#0dbf7e': '#f2f2f2'};
`
:
styled(View)``