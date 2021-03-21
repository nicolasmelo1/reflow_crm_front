import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    align-items: center; 
    justify-content: center;
    height: var(--app-height)
`
:
styled(View)``