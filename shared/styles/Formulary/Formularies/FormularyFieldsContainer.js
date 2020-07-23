import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: ${props=> props.isConditional ? '#f2f2f2': 'transparent'};
    border-radius: 10px;
    margin-bottom: 5px;
    padding: 5px;
`
:
styled(View)``