import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: relative;
    display: inline-block;
    
    @media(min-width: 640px) {
        width: 150px;
        margin: 0 10px 0 0;
    }
    @media(max-width: 710px) {
        width: 49%;
        ${props=> props.hasLeftMargin ? 'margin: 0 0 0 1%;': 'margin: 0 1% 0 0;' }
    }
`
:
styled(View)``