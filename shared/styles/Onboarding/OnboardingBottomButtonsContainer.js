import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'

export default process.env['APP'] === 'web' ?
styled.div`
    display: flex;
    flex-direction: row; 
    justify-content: space-between;
    width: 100%
`
:
styled(View)``