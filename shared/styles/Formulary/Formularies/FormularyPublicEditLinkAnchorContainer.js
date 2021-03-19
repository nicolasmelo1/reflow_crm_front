import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: #0dbf7e50;
    border: 1px solid #0dbf7e;
    border-radius: 5px;
    padding: 5px;
    display: flex;
`
:
styled(View)``