import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.ul`
    margin: 0
`
:
styled(View)`
    margin: 0
`