import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    position: absolute; 
    display: flex; 
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    border-radius: 5px; 
    border: 1px solid #f2f2f2; 
    background-color: white; 
    max-width: calc(var(--app-width) - 150px)
`
:
styled(View)``