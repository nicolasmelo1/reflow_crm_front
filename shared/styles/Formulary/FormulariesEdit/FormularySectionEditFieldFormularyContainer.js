import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%; 
    background-color: #eaeced;
    border-radius: 5px;
    padding: 5px 10px
`
:
styled(View)``