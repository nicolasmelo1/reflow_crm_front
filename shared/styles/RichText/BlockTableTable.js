import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.table`
    width: 100%;
    margin: 10px 0;
`
:
styled(View)``