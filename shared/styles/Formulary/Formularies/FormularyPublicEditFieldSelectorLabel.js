import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.p`
    user-select: none;
    margin: 0;
    padding: 5px;
`
:
styled(View)``