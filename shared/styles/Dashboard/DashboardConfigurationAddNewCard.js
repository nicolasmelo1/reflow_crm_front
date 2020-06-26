import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    border: 1px dashed #0dbf7e;
    padding: 5px;
    background-color: transparent;
    margin-top: 5px;
    min-height: 40px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
`
:
styled(View)``