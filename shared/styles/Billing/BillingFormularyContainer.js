import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #17242D;
    padding: 10px 10px 10px 10px; 
    margin: 0 3px
`
:
styled(View)``