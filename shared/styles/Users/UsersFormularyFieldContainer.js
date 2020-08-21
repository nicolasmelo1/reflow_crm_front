import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%; 
    padding: 10px 0
`
:
styled(View)`
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 15px;
`