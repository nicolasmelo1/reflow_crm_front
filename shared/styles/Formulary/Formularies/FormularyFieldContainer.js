import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border-radius: 10px;
    margin-bottom: 10px;
`
:
styled(View)``