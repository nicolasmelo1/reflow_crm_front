import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 50%;
    display: inline-block;
    box-shadow: 0 3px 6px #17242D;
    border-radius: 10px;
    padding: 10px;
`
:
styled(View)``