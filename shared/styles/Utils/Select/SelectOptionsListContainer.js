import React from 'react'
import styled from 'styled-components'
import { KeyboardAvoidingView } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.ul`
    margin: 0
`
:
styled(KeyboardAvoidingView)`
    margin: 0
`