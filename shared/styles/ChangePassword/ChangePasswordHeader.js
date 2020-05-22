import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div``
:
styled(View)`
    width: 100%;
    display: flex;
    direction: rtl;
    flex-direction: row;
    padding: 10px;
`