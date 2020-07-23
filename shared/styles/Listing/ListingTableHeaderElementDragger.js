import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    cursor: col-resize;
    height: 100%;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    width: 2px;

    &:hover {
        background-color: #0dbf7e
    }
`
:
styled(View)``