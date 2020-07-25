import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    margin: 0 3px;
    padding: 10px;
    background-color: #17242D;    
`
:
styled(View)``