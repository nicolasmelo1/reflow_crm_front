import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    margin: 0 10px;
    background-color: #fff;
    padding: 5px 0;
`
:
styled(View)`
    background-color: #f2f2f2;
    border-bottom-color: #17242D;
    border-bottom-width: 1px;
    padding: 5px 0;
`