import React from 'react'
import styled from 'styled-components'
import { View, PixelRatio } from 'react-native'


export default process.env['APP'] === 'web' ?
styled.div`
    height: calc(var(--app-height) - 100px);
    box-shadow: #3c404315 0px 1px 3px 1px;
    padding: 70px;
    max-width: 595px;
    background-color: #fff;
    margin: auto;
    overflow: auto;
`
:
styled(View)`
    height: ${props => {
        return props.height - (43 * PixelRatio.get())
    }
    }px
`