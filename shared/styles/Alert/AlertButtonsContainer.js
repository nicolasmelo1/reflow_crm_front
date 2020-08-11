import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: ${props => props.withAccept ? 'row' : 'row-reverse'};
    justify-content: space-between;
    margin-top: 10px;
`
:
styled(View)``