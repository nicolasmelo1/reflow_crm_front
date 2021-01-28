import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    margin-top: 1px;
    position: absolute;
    padding: 5px 5px;
    user-select: none;
`
:
styled(View)``