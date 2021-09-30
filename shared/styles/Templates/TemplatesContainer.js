import React from 'react'
import styled from 'styled-components'
import { SafeAreaView } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    position: fixed;
    background-color: #f2f2f2;
    top: 0;
    left: 0;
    height: var(--app-height);
    width: var(--app-width);
`
:
styled(SafeAreaView)`
    background-color: #f2f2f2;
    height: 100%;
`