import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    ${props => props.maintainAspectRatio === false ? `
        min-width: 500px;
        min-height: 450px;
    ` : `
        width: 100%;
    `}
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    padding: 10px;
    border-radius: 20px
`
:
styled(View)``