import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    ${props => props.index !== 0 ? `
        display: flex;
        flex-direction: row;
    ` : ``}
    margin-bottom: 10px; 
`
:
styled(View)``