import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border-radius: 20px;
    padding: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
`
:
styled(View)`
    width: 70%;
    padding: 10px;
`