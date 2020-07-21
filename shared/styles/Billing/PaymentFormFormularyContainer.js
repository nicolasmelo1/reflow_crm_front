import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    width: 100%;
`
:
styled(View)``