import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute;
    padding: 5px 5px;
`
:
styled(View)``