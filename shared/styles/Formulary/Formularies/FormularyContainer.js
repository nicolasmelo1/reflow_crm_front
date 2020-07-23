import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    ${props => props.display === 'bottom' ? 
    `
        position: fixed;
        width: 100vw;
        left:0; 
        bottom: 0; 
        z-index:5;
    ` : ''
    }
`
:
styled(View)``