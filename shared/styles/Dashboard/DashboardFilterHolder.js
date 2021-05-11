import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: relative;
    display: inline-block;
    float: right;
    margin: 0;

    @media(min-width: 740px) {
        width: 200px;
        margin: 0;
    }
    @media(max-width: 740px) {
        width: 100%;
        margin: 5px 0 0 0;
        order: 2;
    }
`
:
styled(View)``