import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: relative;
    display: inline-block;
    margin: 0;

    @media(min-width: 740px) {
        width: 200px;
        margin: 0;
    }
    @media(max-width: 740px) {
        width: 100%;
        margin: 0;
        order: 1;
    }
`
:
styled(View)``