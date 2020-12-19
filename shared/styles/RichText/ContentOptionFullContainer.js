import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    white-space: nowrap
`
:
styled(View)`
    width: 100%;
    height: 50px;
    padding: 5px 0 0 0;
    border-top-width: 1px;
    border-top-color: #0dbf7e;
    background-color: #fff;
    align-self: flex-end;
`