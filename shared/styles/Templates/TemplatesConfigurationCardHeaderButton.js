import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    margin: 0;
    border: 0;
    width: 40px;
    background-color: transparent;
`
:
styled(View)``