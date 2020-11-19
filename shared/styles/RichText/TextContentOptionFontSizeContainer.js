import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: inline-block;
    border: 2px solid #f2f2f2;
    border-radius: 5px;
`
:
styled(View)``