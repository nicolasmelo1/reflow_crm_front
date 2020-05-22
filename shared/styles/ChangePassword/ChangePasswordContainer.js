import React from 'react'
import styled from 'styled-components'
import { SafeAreaView } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: var(--app-height);
`
:
styled(SafeAreaView)`
    padding: 0;
    justify-content: center;
    align-items: center;
    text-align: center;
    flex-direction: column;
`