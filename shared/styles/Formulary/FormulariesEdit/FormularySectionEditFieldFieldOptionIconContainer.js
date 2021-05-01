import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 20px;
    width: 20px;
    border-radius: 3px; 
    border: 1px solid #bfbfbf;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
`
:
styled(View)``