import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    font-size: 18px;
    margin: 5px;
    padding: 0 10px 10px 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    max-height: 130px;
`
:
styled(View)``