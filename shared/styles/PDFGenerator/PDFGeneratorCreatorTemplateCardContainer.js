import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
`
:
styled(View)`
    background-color: #fff;
    margin: 1px 0 0 0;
    padding: 15px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between
`