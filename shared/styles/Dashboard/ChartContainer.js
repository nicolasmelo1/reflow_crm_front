import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: relative;
    ${props => props.maintainAspectRatio === false ? `
        min-width: 500px;
        min-height: 300px;
    ` : `
        width: 100%;
    `}
    display: flex;
    align-items: center;
    justify-content: center;
`
:
styled(View)``