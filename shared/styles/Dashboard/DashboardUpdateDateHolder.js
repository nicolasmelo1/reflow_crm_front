import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    text-align: center;
    margin: 5px 0 0 0;
    
    @media(max-width: 640px) {
        order: 3;
    }
`
:
styled(View)``