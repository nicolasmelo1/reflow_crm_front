import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    margin: 0 10px;
    background-color: #f2f2f2;
    padding: 5px 0;
`
:
styled(View)`
    margin: 0 10px;
    background-color: #f2f2f2;
    padding: 5px 0;
`