import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.button`
    border-radius: 20px;
    width: 25px;
    border: 0;
    background-color: #0dbf7e
`
:
styled(View)``