import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    position: fixed;
    background-color: #f2f2f2;
    top: 0;
    left: 0;
    height: var(--app-height);
    width: 100vw
`
:
styled(View)`
`