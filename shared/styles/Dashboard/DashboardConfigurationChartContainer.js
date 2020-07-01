import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 50%;
    display: inline-block;
    vertical-align: top;
    padding: 10px
`
:
styled(View)``