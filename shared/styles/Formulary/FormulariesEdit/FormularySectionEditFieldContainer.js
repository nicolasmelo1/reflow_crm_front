import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border-top: 2px solid #bfbfbf;
    padding: 5px
`
:
styled(View)``