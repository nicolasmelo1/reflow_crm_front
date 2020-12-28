import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    direction: rtl;
    margin-bottom: 10px;
`
:
styled(View)`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
`