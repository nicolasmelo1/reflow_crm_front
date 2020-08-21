import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding: 0 60px;
    display: flex; 
    flex-direction: row;
    align-items: center;
    margin-bottom: 5px;
`
:
styled(View)`
    padding: 0 60px;
    flex-direction: row;
    align-items: center;
`