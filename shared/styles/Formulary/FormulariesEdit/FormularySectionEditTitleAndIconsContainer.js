import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    background-color: ${props=> props.isConditional ? '#17242D': '#bfbfbf'};
    border-radius: 5px 5px 0 0;
    padding: 1px 0 0 0;
`
:
styled(View)``