import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    padding-bottom: 20px;
    margin-bottom: 20px;
    overflow: auto; 
    
    &:last-child {
        margin-bottom: 110px
    }

    &:not(:last-child) {
        border-bottom: 1px solid #bfbfbf
    }
`
:
styled(View)`
    height: 500px;
    padding: 10px 0;
    border-bottom-width: 1px;
    border-bottom-color: #17242D;
`