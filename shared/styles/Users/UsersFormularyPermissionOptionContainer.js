import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 0 80px;
    display: flex; 
    flex-direction: row;
    align-items: center
`
:
styled(View)`
    padding: 0 80px;
    flex-direction: row;
    align-items: center
`