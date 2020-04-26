import React from 'react'
import styled from 'styled-components'
import { KeyboardAvoidingView } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    @media(max-width: 420px) {
        width: 100%;
    }
    @media(min-width: 420px) {
        position:relative;
    }
`
:
styled(KeyboardAvoidingView)`
    width: 100%;
`