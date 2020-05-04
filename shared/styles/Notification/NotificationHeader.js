import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div``
:
styled(View)`
    flex-direction: row;
    border-bottom-width: 1px;
    border-bottom-color: #f2f2f2; 
    padding: 5px;
`