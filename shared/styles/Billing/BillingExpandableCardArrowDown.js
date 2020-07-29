import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border-top: 20px solid #17242D;
    border-bottom: 20px solid transparent;
    border-right: 20px solid transparent;
    border-left: 20px solid transparent;
    width: 4px;
    height: 4px;
    margin: 0 auto
`
:
styled(View)``