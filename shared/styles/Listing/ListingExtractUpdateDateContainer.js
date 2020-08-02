import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    color: #0dbf7e;
    cursor: pointer
`
:
styled(View)``