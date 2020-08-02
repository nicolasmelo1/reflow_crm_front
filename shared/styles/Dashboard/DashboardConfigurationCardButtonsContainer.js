import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end
`
:
styled(View)`
    align-self: flex-start;
    padding: 10px;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
`