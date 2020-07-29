import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    width: 100%;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: #fff; 
    padding: 10px 
`
:
styled(View)``