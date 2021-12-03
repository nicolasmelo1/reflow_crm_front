import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    height: 3px;
    width: 100%;
    background: #E9EBF0;
    border-radius: 8px;
    margin-bottom: 15px;
`
:
styled(View)``
