import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ? 
styled.div`
    width: 150px
    text-align: center;
    display: inline-block;
    vertical-align: middle;
    border-radius: .25rem;
    padding: 10px;
` 
:
styled(View)``