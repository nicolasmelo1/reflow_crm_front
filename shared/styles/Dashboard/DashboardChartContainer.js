import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding-bottom: 20px;
    margin-bottom: 20px;
    overflow: auto; 
    
    &:last-child {
        margin-bottom: 50px
    }

    &:not(:last-child) {
        border-bottom: 1px solid #bfbfbf
    }
`
:
styled(View)`
    height: 500px;
`